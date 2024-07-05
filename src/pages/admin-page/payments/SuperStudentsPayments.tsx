import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { request } from "../../../request";
import usePayments from "../../../states/adminPayment";
import CRangePicker from "../../../utils/datapicker";
import moment from "moment";
import {ExclamationCircleOutlined } from "@ant-design/icons";
const SuperStudentsPayments = () => {
  const { total,  isModalOpen, showModal, handleCancel, handlePage } =
    usePayments();

  const [form] = useForm();
  const [student, setStudent] = useState([]);
  const [mygroup, setMyGroup] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [groupId, setGroupId] = useState(null);
  
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const branchData = selectedBranch ? `&branch=${selectedBranch}` : ""
  const { confirm } = Modal;

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await request.get(
        `account/payments/?is_student=true${branchData}`
      );
      const responseData = res.data;
      setData(responseData.results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false)
  }, [selectedBranch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      title: "To'lov miqdori",
      render: (text) => text.price_sum + "/" + text.group?.price,
      key: "price_sum",
    },
    {
      title: "To'langan sana",
      render: (text) => moment(text.paid_time).format("YYYY-MM-DD"),
      key: "paid_time",
    },
    {
      title: "sanadan",
      render: (text) => text.from_date,
      key: "from_date",
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
            onClick={() => handleEdit(id)}
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

  const handleEdit = (id: number) => {
    setEditId(id);
    editPayment(id);
    showModal(form); // Show modal after setting form values
  };

  const editPayment = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`account/payment/${id}/`);
        const formattedData = {
          id: data.id,
          price_sum: data.price_sum,
          student: {
            label: `${data?.student?.first_name} ${data?.student?.last_name}`,
            value: data?.student?.id,
          },
          group: data.group.id,
          date: [
            moment(data.from_date).format("MM/DD/YYYY HH:mm:ss"),
            moment(data.to_date).format("MM/DD/YYYY HH:mm:ss"),
          ],
        };
        form.setFieldsValue(formattedData); // Set form values here
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );

  const handleForm = async () => {
    try {
      const values = await form.validateFields();
      values.date = [
        moment(values.date.from_date).valueOf(),
        moment(values.date.to_date).valueOf(),
      ];
      if (values.student && typeof values.student === "object") {
        values.student = values.student.value;
      }
      if (editId) {
        values.id = editId;
        await request.patch(`account/payment-update/${editId}/`, values);
        setEditId(null);
        handleCancel();
        fetchData();
      } else {
        await request.post("account/payment-create/", values);
        handleCancel();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };
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
        fetchData();
      } catch (err) {
        console.log(err);
      }
    },
    [fetchData]
  );
  const getStudent = useCallback(async (groupId: number) => {
    try {
      const res = await request.get(
        `account/student-profiles/?group=${groupId}`
      );
      const data = res.data.results;
      setStudent(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getGroup = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      const data = res.data.results;
      setMyGroup(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      const data = res.data.results;
      setBranches(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getGroup();
    getBranches();
  }, [getGroup, getBranches]);

  const onChange = (value: number) => {
    console.log(`selected ${value}`);
    getStudent(value);
    console.log(value);
    setGroupId(value);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChangeBranch = (value: string) => {
    setSelectedBranch(value);
    fetchData();
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter((item) =>
    `${item.student.first_name} ${item.student.last_name}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <Select
          style={{ width: 200, marginRight: 10 }}
          placeholder="Select Branch"
          onChange={onChangeBranch}
          allowClear
        >
          {branches.map((branch: any) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Search by student name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
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
        dataSource={filteredData}
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
            onClick={() => handleForm()}
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
              filterOption={filterOption}
              options={mygroup.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="student" label="student">
            <Select
              showSearch
              placeholder="student"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={filterOption}
              options={student.map((item) => ({
                label: `${item?.first_name} ${item?.last_name}`,
                value: item?.id,
              }))}
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

export default SuperStudentsPayments;
