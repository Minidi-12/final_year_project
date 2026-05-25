import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://final-year-project-backend-su8k.onrender.com';

export const Api = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  tagTypes: ['B_Req', 'GnOfficer', 'NewsPosts'],
  endpoints: (build) => ({
    getAllb_reqs: build.query({
      query: () => `/b_reqs`,
      providesTags: ['B_Req'],
    }),
    getb_reqByID: build.query({
      query: (id) => ({ url: `/b_reqs/${id}`, method: "GET" }),
      providesTags: ['B_Req'],
    }),
    createb_req: build.mutation({
      query: (b_req) => ({ url: `/b_reqs`, method: "POST", body: b_req }),
      invalidatesTags: ['B_Req'],
    }),
    updateb_req: build.mutation({
      query: ({ id, ...b_req }) => ({ url: `/b_reqs/${id}`, method: "PUT", body: b_req }),
      invalidatesTags: ['B_Req'],
    }),
    deleteb_req: build.mutation({
      query: (id) => ({ url: `/b_reqs/${id}`, method: "DELETE" }),
      invalidatesTags: ['B_Req'],
    }),

    getAllGnOfficers: build.query({
      query: () => `/gnofficers`,
      providesTags: ['GnOfficer'],
    }),
    getGnOfficerByID: build.query({
      query: (id) => ({ url: `/gnofficers/${id}`, method: "GET" }),
    }),
    createGnOfficer: build.mutation({
      query: (officer) => ({ url: `/gnofficers`, method: "POST", body: officer }),
      invalidatesTags: ['GnOfficer'],
    }),
    updateGnOfficer: build.mutation({
      query: ({ id, ...officer }) => ({ url: `/gnofficers/${id}`, method: "PUT", body: officer }),
      invalidatesTags: ['GnOfficer'],
    }),
    deleteGnOfficer: build.mutation({
      query: (id) => ({ url: `/gnofficers/${id}`, method: "DELETE" }),
      invalidatesTags: ['GnOfficer'],
    }),

    getAlldonations: build.query({ query: () => `/donations` }),
    getdonationByID: build.query({ query: (id) => ({ url: `/donations/${id}`, method: "GET" }) }),
    createdonation: build.mutation({ query: (donation) => ({ url: `/donations`, method: "POST", body: donation }) }),
    updatedonation: build.mutation({ query: ({ id, ...donation }) => ({ url: `/donations/${id}`, method: "PUT", body: donation }) }),
    deletedonation: build.mutation({ query: (id) => ({ url: `/donations/${id}`, method: "DELETE" }) }),

    getAllgn_divisions: build.query({ query: () => `/gn_divisions` }),
    getgn_divisionByID: build.query({ query: (id) => ({ url: `/gn_divisions/${id}`, method: "GET" }) }),
    creategn_division: build.mutation({ query: (gn_division) => ({ url: `/gn_divisions`, method: "POST", body: gn_division }) }),
    updategn_division: build.mutation({ query: ({ id, ...gn_division }) => ({ url: `/gn_divisions/${id}`, method: "PUT", body: gn_division }) }),
    deletegn_division: build.mutation({ query: (id) => ({ url: `/gn_divisions/${id}`, method: "DELETE" }) }),

    // — NewsPosts: cache tags added so Activities, Campaigns, and Upcoming
    //   Activities pages auto-refresh immediately after an admin adds content.
    getAllnews_posts: build.query({
      query: () => `/news_posts`,
      providesTags: ['NewsPosts'],
    }),
    getnews_postByID: build.query({
      query: (id) => ({ url: `/news_posts/${id}`, method: "GET" }),
    }),
    createnews_post: build.mutation({
      query: (news_post) => ({ url: `/news_posts`, method: "POST", body: news_post }),
      invalidatesTags: ['NewsPosts'],
    }),
    updatenews_post: build.mutation({
      query: ({ id, ...news_post }) => ({ url: `/news_posts/${id}`, method: "PUT", body: news_post }),
      invalidatesTags: ['NewsPosts'],
    }),
    deletenews_post: build.mutation({
      query: (id) => ({ url: `/news_posts/${id}`, method: "DELETE" }),
      invalidatesTags: ['NewsPosts'],
    }),

    getAllnotifications: build.query({ query: () => `/notifications` }),
    getnotificationByID: build.query({ query: (id) => ({ url: `/notifications/${id}`, method: "GET" }) }),
    createnotification: build.mutation({ query: (notification) => ({ url: `/notifications`, method: "POST", body: notification }) }),
    updatenotification: build.mutation({ query: ({ id, ...notification }) => ({ url: `/notifications/${id}`, method: "PUT", body: notification }) }),
    deletenotification: build.mutation({ query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }) }),

    getAllprojects: build.query({ query: () => `/projects` }),
    getprojectByID: build.query({ query: (id) => ({ url: `/projects/${id}`, method: "GET" }) }),
    createproject: build.mutation({ query: (project) => ({ url: `/projects`, method: "POST", body: project }) }),
    updateproject: build.mutation({ query: ({ id, ...project }) => ({ url: `/projects/${id}`, method: "PUT", body: project }) }),
    deleteproject: build.mutation({ query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }) }),

    getAllvolunteers: build.query({ query: () => `/volunteers` }),
    getvolunteerByID: build.query({ query: (id) => ({ url: `/volunteers/${id}`, method: "GET" }) }),
    createvolunteer: build.mutation({ query: (volunteer) => ({ url: `/volunteers`, method: "POST", body: volunteer }) }),
    updatevolunteer: build.mutation({ query: ({ id, ...volunteer }) => ({ url: `/volunteers/${id}`, method: "PUT", body: volunteer }) }),
    deletevolunteer: build.mutation({ query: (id) => ({ url: `/volunteers/${id}`, method: "DELETE" }) }),
  }),
})

export const {
  useGetAllb_reqsQuery,
  useGetb_reqByIDQuery,
  useCreateb_reqMutation,
  useUpdateb_reqMutation,
  useDeleteb_reqMutation,
  useGetAllGnOfficersQuery,
  useGetGnOfficerByIDQuery,
  useCreateGnOfficerMutation,
  useUpdateGnOfficerMutation,
  useDeleteGnOfficerMutation,
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