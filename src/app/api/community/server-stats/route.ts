import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 获取社区服务器统计信息
    const { data, error } = await supabase
      .from('community_servers')
      .select('status, submitted_at, approved_at, rejected_at');

    if (error) {
      if (error.code === '42P01') {
        console.warn('community_servers 表不存在，返回空统计');
        return NextResponse.json({
          success: true,
          stats: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            approvalRate: 0
          }
        });
      }
      console.error('获取服务器统计失败:', error);
      return NextResponse.json(
        { success: false, message: '获取统计信息失败' },
        { status: 500 }
      );
    }

    // 计算统计信息
    const stats = {
      total: data.length,
      pending: data.filter(s => s.status === 'pending').length,
      approved: data.filter(s => s.status === 'approved').length,
      rejected: data.filter(s => s.status === 'rejected').length,
      approvalRate: data.length > 0 ? 
        Math.round((data.filter(s => s.status === 'approved').length / data.length) * 100) : 0
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('获取服务器统计时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '获取统计信息失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
