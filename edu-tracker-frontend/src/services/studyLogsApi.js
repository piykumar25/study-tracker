import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = (import.meta.env?.VITE_API_BASE_URL) || '/api';

export const studyLogsApi = createApi({
  reducerPath: 'studyLogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken')
        || localStorage.getItem('token')
        || sessionStorage.getItem('authToken');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['StudyLogs', 'StudyLog'],
  endpoints: (build) => ({
    list: build.query({
      query: (params) => ({ url: 'study-logs', params }),
      providesTags: (res) => {
        const base = [{ type: 'StudyLogs', id: 'LIST' }];
        if (!res?.items) return base;
        return [
          ...base,
          ...res.items.map(i => ({ type: 'StudyLog', id: i.id })),
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        endpointName + JSON.stringify(queryArgs || {}),
      merge: (_a, b) => b,
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
    }),
    create: build.mutation({
      query: (body) => ({ url: 'study-logs', method: 'POST', body }),
      invalidatesTags: [{ type: 'StudyLogs', id: 'LIST' }],
    }),
    update: build.mutation({
      query: ({ id, patch }) => ({ url: `study-logs/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (r, e, { id }) => [
        { type: 'StudyLog', id },
        { type: 'StudyLogs', id: 'LIST' },
      ],
    }),
    remove: build.mutation({
      query: (id) => ({ url: `study-logs/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'StudyLogs', id: 'LIST' }],
    }),
  }),
});

export const { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation } = studyLogsApi;
