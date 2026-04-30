import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const Api = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  endpoints: (build) => ({
    getAllb_reqs:build.query({
        query: () => `/b_reqs`
    }),
    getb_reqByID:build.query({
        query: (id) => ({
            url:`/b_reqs/${id}`,
            method:"GET",
        })
    }),
    createb_req:build.mutation({
        query: (b_req) => ({
           url:`/b_reqs`,
           method:"POST",
           body:b_req
        })
    }),
   updateb_req: build.mutation({
      query: ({ id, ...b_req}) => ({
        url: `/b_reqs/${id}`,
        method: "PUT",
        body: b_req,
      }),
   }),
    deleteb_req: build.mutation({
     query: (id) => ({
       url: `/b_reqs/${id}`,
        method: "DELETE",
      }),
    }),
    getAlldonations:build.query({
        query: () => `/donations`
    }),
    getdonationByID:build.query({
        query: (id) => ({
            url:`/donations/${id}`,
            method:"GET",
        })
    }),
    createdonation:build.mutation({
        query: (donation) => ({
           url:`/donations`,
           method:"POST",
           body: donation
        })
    }),
   updatedonation: build.mutation({
      query: ({ id, ...donation}) => ({
        url: `/donations/${id}`,
        method: "PUT",
        body: donation,
      }),
   }),
    deletedonation: build.mutation({
     query: (id) => ({
       url: `/donations/${id}`,
        method: "DELETE",
      }),
    }),
    getAllgn_divisions:build.query({
        query: () => `/gn_divisions`
    }),
    getgn_divisionByID:build.query({
        query: (id) => ({
            url:`/gn_divisions/${id}`,
            method:"GET",
        })
    }),
    creategn_division:build.mutation({
        query: (gn_division) => ({
           url:`/gn_divisions`,
           method:"POST",
           body:gn_division
        })
    }),
   updategn_division: build.mutation({
      query: ({ id, ...gn_division}) => ({
        url: `/gn_divisions/${id}`,
        method: "PUT",
        body: gn_division,
      }),
   }),
    deletegn_division: build.mutation({
     query: (id) => ({
       url: `/gn_divisions/${id}`,
        method: "DELETE",
      }),
    }),
    getAllnews_posts:build.query({
        query: () => `/news_posts`
    }),
    getnews_postByID:build.query({
        query: (id) => ({
            url:`/news_posts/${id}`,
            method:"GET",
        })
    }),
    createnews_post:build.mutation({
        query: (news_post) => ({
           url:`/news_posts`,
           method:"POST",
           body:news_post
        })
    }),
   updatenews_post: build.mutation({
      query: ({ id, ...news_post}) => ({
        url: `/news_posts/${id}`,
        method: "PUT",
        body: news_post,
      }),
   }),
    deletenews_post: build.mutation({
     query: (id) => ({
       url: `/news_posts/${id}`,
        method: "DELETE",
      }),
    }),
    getAllnotifications:build.query({
        query: () => `/notifications`
    }),
    getnotificationByID:build.query({
        query: (id) => ({
            url:`/notifications/${id}`,
            method:"GET",
        })
    }),
    createnotification:build.mutation({
        query: (notification) => ({
           url:`/notifications`,
           method:"POST",
           body:notification
        })
    }),
   updatenotification: build.mutation({
      query: ({ id, ...notification}) => ({
        url: `/notifications/${id}`,
        method: "PUT",
        body: notification,
      }),
   }),
    deletenotification: build.mutation({
     query: (id) => ({
       url: `/notifications/${id}`,
        method: "DELETE",
      }),
    }),
    getAllprojects:build.query({
        query: () => `/projects`
    }),
    getprojectByID:build.query({
        query: (id) => ({
            url:`/projects/${id}`,
            method:"GET",
        })
    }),
    createproject:build.mutation({
        query: (project) => ({
           url:`/projects`,
           method:"POST",
           body:project
        })
    }),
   updateproject: build.mutation({
      query: ({ id, ...project}) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: project,
      }),
   }),
    deleteproject: build.mutation({
     query: (id) => ({
       url: `/projects/${id}`,
        method: "DELETE",
      }),
    }),
    getAllvolunteers:build.query({
        query: () => `/volunteers`
    }),
    getvolunteerByID:build.query({
        query: (id) => ({
            url:`/volunteers/${id}`,
            method:"GET",
        })
    }),
    createvolunteer:build.mutation({
        query: (volunteer) => ({
           url:`/volunteers`,
           method:"POST",
           body:volunteer
        })
    }),
   updatevolunteer: build.mutation({
      query: ({ id, ...volunteer}) => ({
        url: `/volunteers/${id}`,
        method: "PUT",
        body: volunteer,
      }),
   }),
    deletevolunteer: build.mutation({
     query: (id) => ({
       url: `/volunteers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useGetAllb_reqsQuery, 
    useGetb_reqByIDQuery,
    useCreateb_reqMutation,
    useUpdateb_reqMutation,
    useDeleteb_reqMutation,
    useGetAlldonationsQuery, 
    useGetdonationByIDQuery,
    useCreatedonationMutation,
    useUpdatedonationMutation,
    useDeletedonationMutation,
    useGetAllgn_divisionsQuery, 
    useGetgn_divisionByIDQuery,
    useCreategn_divisionMutation,
    useUpdategn_divisionMutation,
    useDeletegn_divisionMutation,
    useGetAllnews_postsQuery, 
    useGetnews_postByIDQuery,
    useCreatenews_postMutation,
    useUpdatenews_postMutation,
    useDeletenews_postMutation,
    useGetAllnotificationsQuery, 
    useGetnotificationByIDQuery,
    useCreatenotificationMutation,
    useUpdatenotificationMutation,
    useDeletenotificationMutation,
    useGetAllprojectsQuery, 
    useGetprojectByIDQuery,
    useCreateprojectMutation,
    useUpdateprojectMutation,
    useDeleteprojectMutation,
    useGetAllvolunteersQuery, 
    useGetvolunteerByIDQuery,
    useCreatevolunteerMutation,
    useUpdatevolunteerMutation,
    useDeletevolunteerMutation,
 } = Api