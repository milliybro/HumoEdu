import React, { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { FormInstance, Modal } from "antd";

import { create } from "zustand";

import { LIMIT } from "../constants";
// import { request } from "../server";
import { AxiosResponse } from "axios";
import { request } from "../request";

const crud = <T>(url: string) => {
  interface DataState {
    search: string;
    offset: string;
    total: number;
    loading: boolean;
    data: T[] | null;
    selected: null | string;
    isModalLoading: boolean;
    isModalOpen: boolean;
    page: number;
    photo: AxiosResponse | null;
    uploadPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearch: (
      e: React.ChangeEvent<HTMLInputElement>,
      navigate: NavigateFunction
    ) => void;
    showModal: (form: FormInstance) => void;
    editData: (form: FormInstance, id: string) => void;
    deleteData: (id: string) => void;
    handleOk: (form: FormInstance) => void;
    closeModal: () => void;
    getData: () => void;
    handlePage: (page: number, navigate: NavigateFunction) => void;
  }
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || 1;
  const search = params.get("search");
  const offset = params.get("offset") ;


  return create<DataState>()((set, get) => {
    return {
      search: search || "", 
      offset: offset || "", 
      total: 0,
      loading: false,
      data: [],
      selected: null,
      isModalLoading: false,
      isModalOpen: false,
      page: +page,
      photo: null,
      handleSearch: (e, navigate) => {
        const { getData } = get();
        const searchValue = e.target.value;
        const page = searchValue !== "" ? 1 : get().page;
        // If search is not empty, set page to 1, otherwise retain the current page value
        set({ search: searchValue, page }); // Update search and page in state
        const query = new URLSearchParams();
        
        query.append("page", page.toString());
        query.append("search", searchValue);
    
        navigate(`/${url}?` + query);
    
        getData();
    },
      handlePage: (page, navigate) => {
        const { search, getData } = get();
        const offset = (page - 1) * 10; // Calculate offset
        set({ page, offset }); // Update page and offset in state
        getData(); // Fetch data
        
        const query = new URLSearchParams();
        query.append("page", page.toString());
        query.append("search", search || "");
        query.append("offset", offset.toString()); // Add offset to query parameters
        
        navigate(`/${url}?${query.toString()}`);
    },
      getData: async () => {
        try {
          const { search, page, offset } = get();
          const params = { search, page, offset }; // Make sure offset is included here
      
          set({ loading: true });
      
          const { data } = await request.get(url, { params });
      
          // set({ data });
        } finally {
          set({ loading: false });
        }
      },

      

      showModal: (form) => {
        setEditId(null)
        set({ isModalOpen: true, selected: null });

        form.resetFields();
      },

      editData: async (form, id) => {
        try {
          set((state) => ({
            ...state,
            selected: id,
            loading: true,
            isModalOpen: true,
          }));
          const { data } = await request.get(`${url}/${id}`);
          form.setFieldsValue(data);
        } finally {
          set((state) => ({ ...state, selected: id, loading: false }));
        }
      },

      deleteData: async (id) => {
        try {
          set({ loading: true });
          Modal.confirm({
            title: "O'chirmoqchimisiz?",
            onOk: async () => {
              try {
                await request.delete(`${url}/${id}`);
                await get().getData();
              } catch (error) {
                console.error("Failed to delete data:", error);
              } finally {
                set({ loading: false });
              }
            },
            onCancel: () => {
              set({ loading: false });
            }
          });
        } catch (error) {
          console.error("Error occurred during deletion process:", error);
          set({ loading: false });
        }
      },

      handleOk: async (form) => {
        try {
          const { selected } = get();
          const values = await form.validateFields();

          set({
            isModalLoading: true,
          });

          if (selected === null) {
            // values.photo = get().photo;
            await request.post(url, values);
          } else {
            await request.put(`${url}/${selected}`, values);
          }

          set({ isModalOpen: false });
          get().getData();
          form.resetFields();
        } finally {
          set({ isModalLoading: false });
        }
      },

      closeModal: () => {
        set((state) => ({ ...state, isModalOpen: false }));
      },

      uploadPhoto: async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        formData.append("file", file);
        const data = await request.post("upload", formData);
        set({ photo: data });
      },
    };
  });
};

export default crud;