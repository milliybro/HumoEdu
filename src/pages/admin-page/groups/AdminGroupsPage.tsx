import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Space, Input, Modal, Select, Table, Pagination, Checkbox , Row, Col} from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import useGroup from "../../../states/adminGroups";
import { request } from "../../../request";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { removeNullish, patchChanges } from "../users/functions";
const AdminGroups = () => {
  const { total, loading, isModalOpen, data, page, handleStatusChange, getData, showModal, handleCancel, handlePage } = useGroup();
  const { branchId } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();
  const [room, setRoom] = useState({});
  const [branch, setBranch] = useState([]);
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
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const { confirm } = Modal;
  const [deleteModal, setDeleteModal] = useState(false);

  const handleGroupSelectChange = (value) => {

    setSelectedGroupName(value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      setBranch(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getTeacher = useCallback(async () => {
    try {
      const res = await request.get(`account/staff-profiles/`);
      setTeacher(res.data.results);
      console.log(teacher)
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getStudent = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profiles/`);
      setStudent(res.data.results);
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
    getBranches();
    getTeacher();
    getStudent();
    getScience();
  }, [getBranches, getTeacher, getStudent, getScience]);

  const getRooms = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/rooms/?branch=${branchId}`);
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
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
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
        record.teacher?.first_name + " " + record.teacher?.last_name,
      key: "teacher",
    },
    {
      title: "Yordamchi o'qituvchi",
      render: (record) =>
        record.sub_teacher
          ? record.sub_teacher?.first_name + " " + record.sub_teacher?.last_name
          : "-",
      key: "teacher",
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
      render: (id: number) => (
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
          <Button onClick={() => nextSchedule(id)}>Dars jadvali</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredData = selectedGroupName ? data.filter((group) => group.name.toLowerCase().includes(selectedGroupName.toLowerCase())) : data;

  const editGroup = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`group/group/${id}/`);
        console.log(data);
        const formattedData = {
          id: data?.id,
          price: data?.price,
          name: data?.name,
          science: data?.science?.id,
          branch: data?.branch?.id,
          teacher: data?.teacher?.id, // Sending teacher id instead of full name
          sub_teacher: typeof data?.sub_teacher === 'object' && data?.sub_teacher !== null ? data?.sub_teacher.id : undefined, // Sending sub_teacher id if exists
          student: data?.student.map((s) => s.id),
          status: data?.status,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );

 const handleOk = (values) => {
  console.log(values);

  const clonedValues = structuredClone(values);

  console.log(clonedValues);

  if (editId) {
    request.put(`group/group-update/${editId}/`, clonedValues).then(() => {
      setEditId(null);
      handleCancel();
      getData();
    });
  } else {
    request.post("group/group-create/", clonedValues).then(() => {
      setEditId(null);
      handleCancel();
      getData();
    });
  }

  
  // form.resetFields();

  //  try {

  //    // Remove nullish values from the form data
  //   //  const cleanedValues = removeNullish(values);
  //   const cleanedValues = values;
  //   //  console.log(cleanedValues, values)

  //    if (editId) {
  //      cleanedValues.id = editId;
  //      const changes = patchChanges(values, cleanedValues);

  //      // Replace the required fields with their new values if changed
  //      if (changes.branch) {
  //        cleanedValues.branch = changes.branch;
  //      }
  //      if (changes.name) {
  //        cleanedValues.name = changes.name;
  //      }
  //      cleanedValues.student = changes.student.map(({value}) => value);
       

  //      await request.put(`group/group-update/${editId}/`, cleanedValues);
  //    } else {
  //    cleanedValues.student = cleanedValues.student.map(({value}) => value);

  //      await request.post("group/group-create/", cleanedValues);
  //    }

    //  setEditId(null);
    //  handleCancel();
    //  getData();
    //  form.resetFields();
  //  } catch (err) {
  //    console.error(err);
  //  }
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
     getData(
       selectedBranch,
       selectedStaff,
       null,
       selectedScience,
       null,
       null,
       selectedStatus,
     );
     getRooms();
   }, [
     getData,
     getRooms,
     selectedBranch,
     selectedStaff,
     selectedStatus,
     selectedScience,
   ]);

   ///// delete modal  ///////
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
    async (id:number) => {
      try {
        await request.delete(`group/group-delete/${id}/`);
        getData();
      } catch (err) {
        console.error(err);
      }
    },
    [getData]
  );

  const nextStudent = (id) => {
     navigate(`/adminGroup/students/${id}`);
  };

  const nextSchedule = (id) => {
    localStorage.setItem("scheduleId", String(id));
    navigate(`/adminGroup/${id}`);
  };

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
    // handleStatusChange(value);
  };


  const modalOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    
  };

  const modalCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
 

  const handleChangeFilterScience = (value) => {
    setSelectedScience(value);
  };
  

  return (
    <Fragment>
      <Modal
        title="Title"
        open={open}
        onOk={modalOk}
        confirmLoading={confirmLoading}
        onCancel={modalCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>Guruhlar boshqaruvi</h3>
        <Button
          onClick={() => showModal(form)}
          type="primary"
          style={{ backgroundColor: "#264653", borderRadius: 5 }}
        >
          Guruh yaratish
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        onOk={() => {
          form.submit();
        }}
        okButtonProps={{ form: "group-update" }}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          id="group-update"
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Guruh nomi"
                rules={[
                  { required: true, message: "Iltimos, guruh nomini kiriting" },
                ]}
              >
                <Input size="large" placeholder="Guruh nomini kiriting" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Kurs narxi"
                rules={[
                  { required: true, message: "Iltimos, kurs narxini kiriting" },
                ]}
              >
                <Input
                  type="number"
                  size="large"
                  placeholder="Kurs narxini kiriting"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="science"
                label="Fanlar"
                rules={[{ required: true, message: "Iltimos, fanni tanlang" }]}
              >
                <Select
                  size="large"
                  placeholder="Fan tanlang"
                  onChange={handleChangeScience}
                >
                  {science.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="branch"
                label="Fillial"
                rules={[
                  { required: true, message: "Iltimos, fillialni tanlang" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Fillial tanlang"
                  onChange={handleChangeBranch}
                >
                  {branch.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="teacher"
                label="O'qituvchi"
                rules={[
                  { required: true, message: "Iltimos, o'qituvchini tanlang" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="O'qituvchi tanlang"
                  onChange={handleChangeStaff} // O'zgartirilgan
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {teacherOptions.map((teacher) => (
                    <Select.Option key={teacher.value} value={teacher.value}>
                      {teacher.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sub_teacher"
                label="Yordamchi o'qituvchi"
                rules={[
                  {
                    required: false,
                    message: "Iltimos, yordamchi o'qituvchini tanlang",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Yordamchi o'qituvchini tanlang"
                  onChange={handleChangeBranch}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {teacherOptions.map((value) => (
                    <Select.Option key={value.value} value={value.value}>
                      {value.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="student"
            label="O'quvchi"
            rules={[
              { required: true, message: "Iltimos, o'quvchilarni tanlang" },
            ]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="O'quvchilarni tanlang"
              onChange={handleChange}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {options.map((student) => (
                <Select.Option key={student.value} value={student.value}>
                  {student.label}
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
        <Input
          placeholder="Search by group name"
          value={selectedGroupName}
          onChange={(e) => handleGroupSelectChange(e.target.value)}
          style={{ width: 200 }}
          suffix={<SearchOutlined />}
        />
        <Select
          placeholder="Fillial tanlang"
          onChange={handleChangeBranch}
          allowClear
        >
          {branch.map((value) => (
            <Select.Option key={value.id} value={value.id}>
              {value.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Fan tanlang"
          onChange={handleChangeFilterScience}
          allowClear
        >
          {science.map((value) => (
            <Select.Option key={value.id} value={value.id}>
              {value.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Status tanlang"
          onChange={handleChangeStatus}
          allowClear
        >
          <Select.Option value=" "> Status </Select.Option>
          <Select.Option value="true">Faol</Select.Option>
          <Select.Option value="false">Faol emas</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
        style={{ maxWidth: "100%" }}
        loading={loading}
      />

      <Pagination
        current={page}
        total={total}
        onChange={handlePage}
        pageSize={10}
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </Fragment>
  );
};

export default AdminGroups;
