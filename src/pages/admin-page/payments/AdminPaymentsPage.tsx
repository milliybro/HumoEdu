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

// import "./style.scss";
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
    data,
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
  const [branch, setBranch] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [groupId, setGroupId] = useState(null);
  const { confirm } = Modal;
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    getData();
  }, [getData]);

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
        text?.student?.first_name + " " + text?.student?.last_name,
      key: "student",
    },
    {
      title: "Guruh nomi",
      render: (data: any) => data.group?.name,
      key: "name",
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
      title: "To'lov miqdori",
      // dataIndex: "student.username",
      render: (text) => text.price_sum + "/" + text.group?.price,
      key: "price_sum",
    },
    {
      title: "To'langanlik",
      render: (text) => {
        const percentage = (text.price_sum / text.group?.price) * 100;
        return `${percentage.toFixed(2)}%`;
      },
      key: "price_sum",
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
          student: data.student.first_name + " " + data.student.last_name,
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
      getData(); // Refresh data after adding new staff or editing existing one
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
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getGroup = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      const data = res.data.results;
      setMyGroup(data);
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
        getData(); // Refresh data after deletion
      } catch (err) {
        console.log(err);
      }
    },
    [getData]
  );

  const handleChangeBranch = (value) => {
    setSelectedBranch(value);
  };

  const handleChangeStaff = (value) => {
    setSelectedStaff(value);
  };

  useEffect(() => {
    getData(selectedBranch, selectedStaff);
  }, [getData, selectedBranch, selectedStaff]);

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

  const getTeacher = useCallback(async () => {
    try {
      const res = await request.get(`account/staff-profiles/`);
      setTeacher(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      setBranch(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getTeacher();
    getStudent();
    getBranches();
  }, [getTeacher, getStudent, getBranches]);3

  return (
    <Fragment>
      <div className="flex justify-between py-4">
        <Space direction="horizontal" size="middle">
          <Input
            placeholder="O'quvchining ismi"
            onChange={(e) => SearchSkills(e)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filialni tanlang"
            value={selectedBranch}
            showSearch
            allowClear
            optionFilterProp="children"
            onChange={handleChangeBranch}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: 200 }}
          >
            {branch.map((value) => (
              <Select.Option key={value.id} value={value.id}>
                {value.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Uqituvchini tanlang"
            value={selectedStaff}
            allowClear
            showSearch
            optionFilterProp="children"
            onChange={handleChangeStaff}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: 200 }}
            options={teacherOptions}
          />
        </Space>
        <Space>
          <Button
            style={{ backgroundColor: "#264653" }}
            onClick={() => showModal(form)}
            type="primary"
          >
            Tolov qo'shish
          </Button>
        </Space>
      </div>

      <div className="w-full h-full mt-4">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
          rowKey="id"
          bordered
          style={{ marginBottom: 16 }}
        />
        <Pagination
          total={total}
          current={page}
          pageSize={LIMIT}
          onChange={handlePage}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title="To'lov qo'shish"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Bekor qilish
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleForm(form)}>
            Saqlash
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="group"
            label="Guruh nomi"
            rules={[{ required: true, message: "Guruh nomini kiriting" }]}
          >
            <Select
              showSearch
              placeholder="Guruh nomini tanlang"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              style={{ width: 200 }}
            >
              {mygroup.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="student"
            label="Talaba ismi"
            rules={[{ required: true, message: "Talaba ismini kiriting" }]}
          >
            <Select
              showSearch
              placeholder="Talaba ismini tanlang"
              optionFilterProp="children"
              onChange={(value) => console.log(`selected ${value}`)}
              onSearch={onSearch}
              filterOption={filterOption}
              style={{ width: 200 }}
            >
              {student.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.first_name + " " + value.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price_sum"
            label="To'lov miqdori"
            rules={[{ required: true, message: "To'lov miqdorini kiriting" }]}
          >
            <Input placeholder="To'lov miqdorini kiriting" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Sanani tanlang"
            rules={[{ required: true, message: "Sanani tanlang" }]}
          >
            <CRangePicker showTime format="MM/DD/YYYY HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AdminPayments;
