import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ServerSubmission {
  name: string;
  description: string;
  endpoint: string;
  category?: string;
  features?: string[];
  compatibility?: string[];
  installCommand?: string;
  documentationUrl?: string;
  submitterEmail?: string;
  submitterName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const submission: ServerSubmission = await request.json();

    // 验证必需字段
    if (!submission.name || !submission.description || !submission.endpoint) {
      return NextResponse.json(
        { success: false, message: '缺少必需字段' },
        { status: 400 }
      );
    }

    // 验证端点格式
    if (!isValidEndpoint(submission.endpoint)) {
      return NextResponse.json(
        { success: false, message: '无效的端点格式' },
        { status: 400 }
      );
    }

    // 保存到数据库
    const { data, error } = await supabase
      .from('community_servers')
      .insert({
        name: submission.name,
        description: submission.description,
        endpoint: submission.endpoint,
        category: submission.category || 'general',
        features: submission.features || [],
        compatibility: submission.compatibility || [],
        install_command: submission.installCommand,
        documentation_url: submission.documentationUrl,
        submitter_email: submission.submitterEmail,
        submitter_name: submission.submitterName,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('保存服务器提交失败:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: '保存失败', 
          error: error.message,
          details: error.details || error.hint || '数据库操作失败'
        },
        { status: 500 }
      );
    }

    // 发送通知邮件（这里可以集成邮件服务）
    // await sendNotificationEmail(submission);

    return NextResponse.json({
      success: true,
      message: '服务器提交成功，等待审核',
      submissionId: data.id
    });

  } catch (error) {
    console.error('处理服务器提交时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '提交失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

function isValidEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' || url.protocol === 'http:' || endpoint.startsWith('stdio://');
  } catch {
    return endpoint.startsWith('stdio://') || endpoint.includes('://');
  }
}

export async function GET() {
  try {
    // 获取待审核的服务器提交
    const { data, error } = await supabase
      .from('community_servers')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('获取服务器提交失败:', error);
      return NextResponse.json(
        { success: false, message: '获取失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submissions: data
    });

  } catch (error) {
    console.error('获取服务器提交时出错:', error);
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
