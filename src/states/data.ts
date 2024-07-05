import { create } from "zustand";
import { FormInstance, message } from "antd";
import { request } from "../request";
import { NavigateFunction } from "react-router-dom";

 function getData<T>(url: string) {
  const params = new URLSearchParams(window.location.search);

  const page = params.get("offset") || 10;
  interface DataInterface {
    data: T[];
    total: number;
    next: number;
    photo: string | null;
    portPhoto: string | null;
    portPhotoType: string | null;
    selected: string | null;
    search: string;
    offset: string;
    loading: boolean;
    totalPaginate: number;
    active: number;
    isModalOpen: boolean;
    page: number;
    status: string;
    handlePage: (page: number, navigate: NavigateFunction) => void;
    getData: () => void;
    handleOk: (form: FormInstance) => void;
    editData: (id: number, form: FormInstance) => void;
    deleteData: (id: number) => void;
    setActive: (active: boolean) => void;
    showModal: (form: FormInstance) => void;
    handleCancel: () => void;
    SerachSkills: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePhoto: (file: FormData | undefined) => void;
    handlePortfoliosPhoto: (file: FormData | undefined) => void;
    handleStatusChange: (value: string) => void;
  }
  return create<DataInterface>()((set, get) => ({
    data: [],
    total: 0,
    next: null,
    photo: null,
    portPhoto: null,
    portPhotoType: null,
    selected: null,
    search: "",
    loading: false,
    totalPaginate: 1,
    active: 1,
    page: +page,
    status: "",
    isModalOpen: false,
    offset: "",
    // handlePage: (page, navigate) => {
    //   const { search, status,  getData } = get();
    //   const offset = (page - 1) * 10; // Calculate offset
    //   set({ page, offset }); // Update page and offset in state
    //   getData(); // Fetch data

    //   const query = new URLSearchParams();
    //   query.append("page", page.toString());
    //   query.append("offset", offset.toString());
    //   if (status) query.append("status", status); // Add offset to query parameters

    //   navigate(`?${query.toString()}`);
    // },

    handlePage: (page, navigate) => {
      const { search, status, getData, science, staff, student__branch, user } = get();
      const offset = (page - 1) * 10; // Calculate offset
      set({ page, offset }); // Update page and offset in state
      getData(); // Fetch data

      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("offset", offset.toString()); // Add offset to query parameters
      if (search) query.append("search", search);
      if (status) query.append("status", status);
      if (science) query.append("science", science);
      if (staff) query.append("staff", staff);
      if (student__branch) query.append("student__branch", student__branch);
      if (user) query.append("user", user);



      navigate(`?${query.toString()}`);
    },
    getData: async (branch, user__roles, staff, science, student__branch, user) => {
      const { search, page, offset, status } = get();

      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (offset) params.append("offset", offset);
        if (status) params.append("status", status);
        if (branch) params.append("branch", branch);
        if (user) params.append("user", user);
        if (user__roles) params.append("user__roles", user__roles);
        if (science) params.append("science", science);
        if (staff) params.append("staff", staff);
        if (student__branch) params.append("student__branch", student__branch);

        set({ loading: true });
        const { data } = await request.get(`${url}?${params.toString()}`);
        set({ data: data.results, total: data.count, next: data.next });
      } catch (error) {
        message.error("Server bilan hatolik !");
      } finally {
        set({ loading: false });
      }
    },
    // getData: async (branch, user__roles, status) => {
    //   const { search, page, offset } = get();

    //   try {
    //     const params = new URLSearchParams();
    //     if (search) params.append("search", search);
    //     if (offset) params.append("offset", offset);
    //     if (status) params.append("status", status);
    //     if (branch) params.append("branch", branch);
    //     if (user__roles) params.append("user__roles", user__roles);

    //     set({ loading: true });
    //     const { data } = await request.get(`${url}?${params.toString()}`);
    //     set({ data: data.results, total: data.count, next: data.next });
    //   } catch (error) {
    //   } finally {
    //     set({ loading: false });
    //   }
    // },
    handleOk: async (form) => {
      const { selected, getData } = get();
      const oldValues = await form.validateFields();
      let values = get().photo ? { ...oldValues, photo: get().photo } : { ...oldValues };
      values = get().portPhoto ? { ...values, photo: get().portPhoto } : { ...values };

      try {
        if (selected === null) {
          await request.post(url, values);
        } else {
          await request.put(`${url}/${selected}`, values);
        }
        getData();
        set((state) => ({ ...state, isModalOpen: false }));
      } catch (err) {
        message.error("No information added!");
      }
    },
    editData: async (id, form) => {
      const { data } = await request.get(`${url}/${id}`);
      const values = data.endDate ? { ...data, endDate: data.endDate.split("T")[0], startDate: data.startDate.split("T")[0] } : { ...data };

      form.setFieldsValue(values);
      set((state) => ({ ...state, selected: id, isModalOpen: true }));
    },
    deleteData: async (id) => {
      const deleteConfirm = confirm("deleted");
      if (deleteConfirm) {
        await request.delete(`${url}/${id}`);
        get().getData();
      }
    },
    setActive: (active) => {
      set((state) => ({ ...state, active }));
      get().getData();
    },
    showModal: (form) => {
      form.resetFields();
      set((state) => ({ ...state, selected: null, photo: null, isModalOpen: true }));
    },
    handleCancel: () => {
      set((state) => ({ ...state, isModalOpen: false, selected: null }));
    },
    SearchSkills: (e) => {
      set((state) => ({ ...state, search: e.target.value }));
      get().getData();
    },
    handlePhoto: async (file) => {
      const { data: photo } = await request.post("upload", file);
      const userPhoto = `${photo._id}.${photo.name.split(".")[1]}`;
      set((state) => ({ ...state, photo: userPhoto }));
    },
    handlePortfoliosPhoto: async (file) => {
      const { data: photo } = await request.post("upload", file);
      const userPhoto = `${photo._id}.${photo.name.split(".")[1]}`;
      set({ portPhoto: photo._id, photo: userPhoto, portPhotoType: photo.name.split(".")[1] });
    },
    handleStatusChange: (value: string) => {
      set({ status: value });
      get().getData();
    },
  }));
}

export default getData;
