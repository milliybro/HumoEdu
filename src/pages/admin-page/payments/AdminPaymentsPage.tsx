import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Form,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Pagination,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";

import { LIMIT } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../../../request";
import usePayments from "../../../states/adminPayment";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import CRangePicker from "../../../utils/datapicker";
import moment from "moment";

const AdminPayments = () => {
  const {
    total,
    loading,
    isModalOpen,
    page,
    getData,
    editData,
    deleteData,
    SearchSkills,
    showModal,
    handleCancel,
    handleOk,
    handlePage,
  } = usePayments();

  const { branchId } = useParams();
  console.log(branchId, "branchId");

  const [form] = useForm();
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);
  const [mygroup, setMyGroup] = useState([]);
  const [editId, setEditId] = useState(null); // State variable to hold the id
  // const [branch, setBranch] = useState([]);
  const [teacher, setTeacher] = useState([]);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [selectedGroupName, setSelectedGroupName] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [data, setData] = useState([])
  const [groupId, setGroupId] = useState(null);
  const { confirm } = Modal;
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeButton, setActiveButton] = useState<"student" | "teacher">(
    "student"
  ); // Added state for active button

  // getData funksiyasini o'zgartiramiz
   const fetchData = useCallback(async (isStudent, offset = 0) => {
     try {
       const res = await request.get(
         `account/payments/?is_student=${isStudent}&limit=10&offset=${offset}`
       );
       const responseData = res.data;
       setData(responseData.results);
     } catch (err) {
       console.error(err);
     }
   }, []);

   useEffect(() => {
     const offset = activeButton === "student" ? 0 : 0; // Adjust offset based on activeButton
     fetchData(activeButton === "student", offset);
   }, [fetchData, activeButton]);

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ism Familiya",
      render: (text) =>
        activeButton === "teacher"
          ? text?.teacher?.first_name + text?.teacher?.last_name
          : text?.student?.first_name + " " + text?.student?.last_name,
      key: "student",
    },
    {
      title: "Guruh nomi",
      render: (data: any) => data.group?.name,
      key: "name",
    },

    {
      title: "To'lov miqdori",
      // dataIndex: "student.username",
      render: (text) => text.price_sum + "/" + text.group?.price,
      key: "price_sum",
    },
    {
      title: "To'langan sana",
      // dataIndex: "student.username",
      render: (text) => moment(text.paid_time).format("YYYY-MM-DD"),
      key: "paid_time",
    },
    {
      title: "sanadan",
      render: (text) => text.from_date,
      key: "from_date",
    },
    {
      title: "Kunlik",
      render: (text) => {
        const fromDate = moment(text.from_date);
        const toDate = moment(text.to_date);
        const differenceInDays = toDate.diff(fromDate, "days");
        return differenceInDays + " kun";
      },
      key: "date",
    },
    {
      title: "sanagacha",
      render: (text) => text.to_date,
      key: "to_date",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: any) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#264653" }}
            onClick={() => {
              showModal(form);
              setEditId(id); // Set the id when Edit button is clicked
              editPayment(id);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => showDeleteConfirm(id)}
            type="primary"
            style={{
              backgroundColor: "#f54949",
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const editPayment = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`account/payment/${id}/`);
        const formattedData = {
          id: data.id,
          price_sum: data.price_sum,
          student: data.student
            ? data.student.first_name + " " + data.student.last_name
            : null,
          teacher: data.teacher
            ? data.teacher.first_name + " " + data.teacher.last_name
            : null,
          group: data.group.name,
          date: [
            moment(data.date.from_date).format("MM/DD/YYYY HH:mm:ss"),
            moment(data.date.to_date).format("MM/DD/YYYY HH:mm:ss"),
          ],
        };
        console.log(formattedData, "formattedData");
        setEditId(formattedData.id);

        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );

  const handleForm = async (formData: any) => {
    console.log(formData, "formData");

    try {
      const values = await formData.validateFields();

      values.date = [
        moment(values.date.from_date).valueOf(),
        moment(values.date.to_date).valueOf(),
      ];

      if (editId) {
        values.id = editId;
        await request.patch(`account/payment-update/${editId}/`, values);
      } else {
        await request.post("account/payment-create/", values);
      }
      setEditId(null);
      handleCancel();
      fetchData(activeButton === "student"); // Refresh data after adding new staff or editing existing one
    } catch (err) {
      console.error(err);
    }
  };

  const getStudent = useCallback(async (groupId: number) => {
    try {
      const res = await request.get(
        `account/student-profiles/?group=${groupId}`
      );
      const data = res.data.results;
      setStudent(data);
      console.log(data);
    } catch (error) {
      console.log();
    }
  }, []);

   

  const getGroup = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      const data = res.data.results;
      setMyGroup(data);
      console.log(data)
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getStudent();
    getGroup();
  }, [getStudent, getGroup]);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (value: number) => {
    console.log(`selected ${value}`);
    getStudent(value);
    console.log(value);
    setGroupId(value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  ///// delete modal  ///////
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: "Bu to'lovni ro'yhatdan o'chirishni hohlaysizmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amalni ortga qaytarib bo‘lmaydi.",
      okText: "ha",
      okType: "danger",
      cancelText: "ortga",
      onOk() {
        deletePayment(id);
      },
      onCancel() {
        setDeleteModal(false);
      },
    });
  };

  const deletePayment = useCallback(
    async (id) => {
      try {
        await request.delete(`account/payment-delete/${id}/`);
        fetchData(activeButton === "student");
      } catch (err) {
        console.log(err);
      }
    },
    [fetchData, activeButton]
  );

  const handleChangeBranch = (value) => {
    setSelectedBranch(value);
  };

  const handleChangeStaff = (value) => {
    setSelectedStaff(value);
  };

  useEffect(() => {
    fetchData(selectedBranch, selectedStaff);
  }, [fetchData, selectedBranch, selectedStaff]);

  const [teacherOptions, setTeacherOptions] = useState([]);
  useEffect(() => {
    const teacherOptions = teacher
      .filter((value) => value?.user.roles === "teacher")
      .map((value) => ({
        label: `${value?.first_name} ${value?.last_name}`,
        value: value.id,
      }));
    setTeacherOptions(teacherOptions);
  }, [teacher]);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-4">
          <Button
            type={activeButton === "student" ? "primary" : "default"}
            onClick={() => setActiveButton("student")}
          >
            Studentlar
          </Button>
          <Button
            type={activeButton === "teacher" ? "primary" : "default"}
            onClick={() => setActiveButton("teacher")}
          >
            O'qituvchilar
          </Button>
        </div>
        <Button
          onClick={() => showModal(form)}
          style={{ backgroundColor: "#264653", color: "white" }}
        >
          To'lov qo'shish
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          total: total,
          pageSize: 10,
          onChange: handlePage,
        }}
      />

      <Modal
        open={isModalOpen}
        title="To'lovlar"
        onOk={handleForm}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => handleForm(form)}
          >
            Saqlash
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="paymentForm">
          <Form.Item name="group" label="Guruh">
            <Select
              showSearch
              placeholder="Guruh tanlang"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={mygroup.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name={activeButton === "student" ? "student" : "teacher"}
            label={activeButton === "student" ? "Student" : "Teacher"}
          >
            <Select
              showSearch
              placeholder={activeButton === "student" ? "Student" : "Teacher"}
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={
                activeButton === "teacher"
                  ? teacher.map((t) => ({
                      label: `${t?.first_name} ${t?.last_name}`,
                      value: t?.id,
                    }))
                  : student.map((item) => ({
                      label: `${item?.first_name} ${item?.last_name}`,
                      value: item?.id,
                    }))
              }
            />
          </Form.Item>

          <Form.Item name="price_sum" label="To'lov miqdori">
            <Input placeholder="To'lov miqdorini kiriting" />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <CRangePicker />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AdminPayments;
