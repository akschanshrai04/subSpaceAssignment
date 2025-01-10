import ChangeEmail from '@/components/profile/change-email'
import ChangePassword from '@/components/profile/change-password'
import JwtClaims from '@/components/profile/jwt-claims'
import UserInfo from '@/components/profile/user-info'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthQuery } from '@nhost/react-apollo';
import React, { useState } from 'react';
import { History, Youtube, ChevronDown, ChevronUp } from 'lucide-react';
import { gql, useMutation } from '@apollo/client'





export default function Profile() {
  
  const { data, refetch: refetchSummaries } = useAuthQuery<{
    summaries: Array<{
      id: string;
      summary: string;
      youtube_url: string;
      created_at: Date;
    }>;
  }>(gql`
    query {
      summaries(order_by: { created_at: desc }) {
        id
        summary
        youtube_url
        created_at
      }
    }
  `);

  return (
    <div className="flex flex-col w-full gap-4">
      <Card className="w-full">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <History className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
        </div>
        
        {data?.summaries.map((summary) => (
              <div
                key={summary.id}
                className="flex flex-row items-center justify-between w-full p-4 border-b last:pb-0 last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-bold">summary : {summary.summary}</span>
                  <a
                    href={summary.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {summary.youtube_url}
                  </a>
                  <span className="font-bold">date : {summary.created_at.toString()}</span>
                </div>
              </div>
            ))}
      </div>
      </Card>
      <ChangeEmail />
      <ChangePassword />
      <UserInfo />
      <JwtClaims />
    </div>
  )
}


