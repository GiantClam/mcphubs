import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface CurationAction {
  action: 'approve' | 'reject' | 'feature' | 'unfeature';
  submissionId?: string;
  projectId?: string;
  reason?: string;
  featuredUntil?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, submissionId, projectId, reason, featuredUntil }: CurationAction = await request.json();

    if (action === 'approve' && submissionId) {
      // 批准社区提交的服务器
      const { data: submission, error: fetchError } = await supabase
        .from('community_servers')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (fetchError || !submission) {
        return NextResponse.json(
          { success: false, message: '找不到提交记录' },
          { status: 404 }
        );
      }

      // 更新状态为已批准
      const { error: updateError } = await supabase
        .from('community_servers')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'admin' // 这里应该从认证中获取
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('批准提交失败:', updateError);
        return NextResponse.json(
          { success: false, message: '批准失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '服务器提交已批准'
      });

    } else if (action === 'reject' && submissionId) {
      // 拒绝社区提交的服务器
      const { error } = await supabase
        .from('community_servers')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
          rejected_by: 'admin'
        })
        .eq('id', submissionId);

      if (error) {
        console.error('拒绝提交失败:', error);
        return NextResponse.json(
          { success: false, message: '拒绝失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '服务器提交已拒绝'
      });

    } else if (action === 'feature' && projectId) {
      // 将项目设为推荐
      const { error } = await supabase
        .from('featured_projects')
        .upsert({
          project_id: projectId,
          featured_at: new Date().toISOString(),
          featured_until: featuredUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 默认30天
          featured_by: 'admin',
          reason: reason || '手动推荐'
        });

      if (error) {
        console.error('推荐项目失败:', error);
        return NextResponse.json(
          { success: false, message: '推荐失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '项目已设为推荐'
      });

    } else if (action === 'unfeature' && projectId) {
      // 取消项目推荐
      const { error } = await supabase
        .from('featured_projects')
        .update({ 
          featured_until: new Date().toISOString(),
          unfeatured_at: new Date().toISOString(),
          unfeatured_by: 'admin'
        })
        .eq('project_id', projectId);

      if (error) {
        console.error('取消推荐失败:', error);
        return NextResponse.json(
          { success: false, message: '取消推荐失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '项目推荐已取消'
      });

    } else {
      return NextResponse.json(
        { success: false, message: '无效的操作' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('策展操作失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '操作失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 获取待审核的提交
    const { data: pendingSubmissions, error: submissionsError } = await supabase
      .from('community_servers')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (submissionsError) {
      console.error('获取待审核提交失败:', submissionsError);
    }

    // 获取推荐项目
    const { data: featuredProjects, error: featuredError } = await supabase
      .from('featured_projects')
      .select(`
        *,
        github_projects (
          id, name, description, stars, forks, language, owner, url, image_url
        )
      `)
      .gte('featured_until', new Date().toISOString())
      .order('featured_at', { ascending: false });

    if (featuredError) {
      console.error('获取推荐项目失败:', featuredError);
    }

    return NextResponse.json({
      success: true,
      pendingSubmissions: pendingSubmissions || [],
      featuredProjects: featuredProjects || []
    });

  } catch (error) {
    console.error('获取策展数据失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '获取失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
