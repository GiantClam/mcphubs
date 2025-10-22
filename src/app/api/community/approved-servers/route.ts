import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 获取已审核通过的社区服务器
    const { data, error } = await supabase
      .from('community_servers')
      .select('*')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        console.warn('community_servers 表不存在，返回空数据');
        return NextResponse.json({
          success: true,
          data: []
        });
      }
      console.error('获取已审核服务器失败:', error);
      return NextResponse.json(
        { success: false, message: '获取服务器列表失败' },
        { status: 500 }
      );
    }

    // 转换为RemoteMcpServer格式
    const approvedServers = (data || []).map(server => ({
      id: server.id,
      name: server.name,
      description: server.description,
      connect_url: server.endpoint,
      auth_type: 'open' as const,
      category: server.category,
      tags: ['community', ...(server.features || [])],
      status: 'active' as const,
      updated_at: server.approved_at || server.submitted_at
    }));

    return NextResponse.json({
      success: true,
      data: approvedServers
    });

  } catch (error) {
    console.error('获取已审核服务器时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '获取服务器列表失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
