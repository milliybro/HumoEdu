import  { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Space, Input, Modal, Select, Table, Pagination, Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import useGroup from "../../../states/adminGroups";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;
const BranchGroups = () => {
  const { total, loading, isModalOpen, data, page, handleStatusChange, getData, showModal, handleCancel, handlePage } = useGroup();
  const { branchId } = useAuth();
  const [form] = useForm();
  const navigate = useNavigate();
  const [room, setRoom] = useState({});
  const [teacher, setTeacher] = useState([]);
  const [student, setStudent] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [science, setScience] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedScience, setSelectedScience] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteModal, setDeleteModal] = useState(false)

  const handleGroupSelectChange = (value) => {
    setSelectedGroupName(value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  

  const getTeacher = useCallback(async () => {
    try {
      const res = await request.get(`account/staff-profiles/?branch=${branchId}`);
      setTeacher(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getStudent = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profiles/?branch=${branchId}`);
      setStudent(res.data.results);
      console.log(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getScience = useCallback(async () => {
    try {
      const res = await request.get(`group/sciences/`);
      setScience(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getTeacher();
    getStudent();
    getScience();
  }, [ getTeacher, getStudent, getScience]);

  const getRooms = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/rooms/${branchId}/`);
      setRoom(data);
    } catch (err) {
      console.error(err);
    }
  }, [branchId]);

  useEffect(() => {
    getData();
    getRooms();
  }, [getData, getRooms]);
  const columns = [
    {
      title: "Guruh nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kurs narxi",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Fan nomi",
      render: (record) => record?.science?.name,
      key: "science",
    },
    {
      title: "O'qituvchi",
      render: (record) =>
        record.teacher.first_name + " " + record.teacher.last_name,
      key: "teacher",
    },
    {
      title: "Yordamchi o'qituvchi",
      render: (record) =>
        record.sub_teacher ? record.sub_teacher.first_name + " " + record.sub_teacher.last_name : " ",
      key: "sub_teacher",
    },
    {
      title: "O'quvchilar soni",
      render: (record) => record.student.length,
      key: "students",
    },
    {
      title: "Fillial",
      render: (record) => record.branch.name,
      key: "branch",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <h5 style={{ color: "green" }}>Faoliyatda</h5>
        ) : (
          <h5 style={{ color: "red" }}>Faoliyatda emas</h5>
        ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id:number) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal(form);
              setEditId(id); // Set the id when Edit button is clicked
              editGroup(id);
            }}
            type="primary"
            style={{ backgroundColor: "#264653" }}
          >
            Edit
          </Button>
          <Button
            onClick={() => showDeleteConfirm(id)}
            type="primary"
            style={{ backgroundColor: "#f54949" }}
          >
            Delete
          </Button>
          <Button onClick={() => nextStudent(id)}>O'quvchilar</Button>
          <Button onClick={() => nextSchedule(id)}>
            Dars jadvali
          </Button>
        </Space>
      ),
    },
  ];


  //////////////// delete function parm ////////////
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: "Bu guruhni ro'yhatdan o'chirishni hohlaysizmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amalni ortga qaytarib bo‘lmaydi.",
      okText: "ha",
      okType: "danger",
      cancelText: "ortga",
      onOk() {
        deleteGroup(id);
      },
      onCancel() {
        setDeleteModal(false);
      },
    });
  };
  
    const deleteGroup = useCallback(
      async (id: number) => {
        try {
          await request.delete(`account/staff-profile-delete/${id}/`);
          getData();
        } catch (err) {
          console.error(err);
        }
      },
      [getData]
    );
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredData = selectedGroupName ? data.filter((group) => group.name.toLowerCase().includes(selectedGroupName.toLowerCase())) : data;

  const editGroup = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`group/group/${id}/`);
        console.log(data);
        const formattedData = {
          id: data.id,
          price: data.price,
          name: data.name,
          science: data.science.id,
          branch: data.branch.id,
          teacher: data.teacher.id,
          sub_teacher:data.sub_teacher.map((st)=>st?.id),
          student: data.student.map((studentMember) => studentMember),
          status: data.status,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
        showModal();
      } catch (err) {
        console.error(err);
      }
    },
    [form, showModal]
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const branch = branchId;
      const updateValues = {...values, branch}
      if (editId) {
        values.id = editId;
        await request.put(`group/group-update/${editId}/`, updateValues);
      } else {
        await request.post("group/group-create/", updateValues);
      }

      setEditId(null);
      handleCancel();
      getData();
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const [options, setOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);

  useEffect(() => {
    const options = student.map((data) => ({
      label: `${data.first_name} ${data.last_name}`,
      value: data.id,
    }));
    setOptions(options);
  }, [student]);

  useEffect(() => {
    const teacherOptions = teacher
      .filter((value) => value.user.roles === "teacher")
      .map((value) => ({
        label: `${value.first_name} ${value.last_name}`,
        value: value.id,
      }));
    setTeacherOptions(teacherOptions);
  }, [teacher]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleChangeBranch = (value) => {
    setSelectedBranch(value);
  };

  const handleChangeScience = (value) => {
    setSelectedScience(value);
  };

  const handleChangeStaff = (value) => {
    setSelectedStaff(value);
  };

  useEffect(() => {
    getData(selectedBranch, selectedScience, selectedStaff);
  }, [getData, selectedBranch, selectedScience, selectedStaff]);

 

  const nextStudent = (id) => {
    navigate(`/adminBranch/${id}`);
  };

  const nextSchedule = (id) => {
    localStorage.setItem("scheduleId", String(id));
    navigate(`/adminGroup/${id}`);
  };

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
    handleStatusChange(value);
  };

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>Guruhlar boshqaruvi</h3>
        <Button onClick={() => showModal(form)} type="primary" style={{ backgroundColor: "#264653", borderRadius: 5 }}>
          Guruh yaratish
        </Button>
      </div>

      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Iltimos, guruh nomini kiriting" }]}>
            <Input size="large" placeholder="Guruh nomini kiriting" />
          </Form.Item>
          <Form.Item name="price" label="Kurs narxi" rules={[{ required: true, message: "Iltimos, kurs narxini kiriting" }]}>
            <Input type="number" size="large" placeholder="Kurs narxini kiriting" />
          </Form.Item>
          <Form.Item name="science" label="Fanlar" rules={[{ required: true, message: "Iltimos, fanni tanlang" }]}>
            <Select size="large" placeholder="Fan tanlang" onChange={handleChangeScience}>
              {science.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        
          <Form.Item name="teacher" label="O'qituvchi" rules={[{ required: true, message: "Iltimos, o'qituvchini tanlang" }]}>
            <Select  size="large" placeholder="O'qituvchi tanlang" onChange={handleChangeStaff}>
              {teacher.map((teacher) => (
                <Select.Option key={teacher.id} value={teacher.id}>
                  {teacher.first_name  + teacher.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
           <Form.Item name="sub_teacher" label="Yordamchi o'qituvchi " rules={[{ required: false, message: "Iltimos, o'qituvchini tanlang" }]}>
            <Select mode="multiple" size="large" placeholder="Yordamchi o'qituvchi tanlang" onChange={handleChangeBranch}>
              {teacher.map((teacher) => (
               <Select.Option key={teacher.id} value={teacher.id}>
                  {teacher.first_name  + teacher.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="student" label="O'quvchi" rules={[{ required: true, message: "Iltimos, o'quvchilarni tanlang" }]}>
            <Select mode="multiple" size="large" placeholder="O'quvchilarni tanlang" onChange={handleChange}>
              {student.map((student) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.first_name + student.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" valuePropName="checked">
            <Checkbox>Status</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Space style={{ margin: "15px 0" }}>
        <Input placeholder="Search by group name" value={selectedGroupName} onChange={(e) => handleGroupSelectChange(e.target.value)} style={{ width: 200 }} suffix={<SearchOutlined />} />
        {/* <Select placeholder="Fillial tanlang" onChange={handleChangeBranch} allowClear>
          {branch.map((value) => (
            <Select.Option key={value.id} value={value.id}>
              {value.name}
            </Select.Option>
          ))}
        </Select> */}
        <Select placeholder="Fan tanlang" onChange={handleChangeScience} allowClear>
          {science.map((value) => (
            <Select.Option key={value.id} value={value.id}>
              {value.name}
            </Select.Option>
          ))}
        </Select>
        <Select placeholder="O'qituvchi tanlang" onChange={handleChangeStaff} allowClear>
          {teacherOptions.map((teacher) => (
            <Select.Option key={teacher.value} value={teacher.value}>
              {teacher.label}
            </Select.Option>
          ))}
        </Select>
        <Select placeholder="Status tanlang" onChange={handleChangeStatus} allowClear>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
        <Button onClick={toggleSearch}>{isSearchOpen ? "Yopish" : "Izlash"}</Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={false} loading={loading} />

      <Pagination current={page} total={total} onChange={handlePage} pageSize={10} style={{ marginTop: 20, textAlign: "center" }} />
    </Fragment>
  );
};

export default BranchGroups;
