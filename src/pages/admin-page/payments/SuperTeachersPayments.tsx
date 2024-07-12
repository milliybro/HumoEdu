import React, { useEffect, useState, useCallback } from "react";
import { Table, Modal, Form, Input, Button, Select, Space } from "antd";
import moment from "moment";
import { request } from "../../../request";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CRangePicker from "../../../utils/datapicker";
const { Option } = Select;
const {confirm } = Modal;
const SuperTeachersPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]); // State for branches

  const [form] = Form.useForm();
 


   
  useEffect(() => {
    fetchPayments();
    fetchGroups();
  }, [selectedBranch, selectedGroup]);

  const fetchPayments = async () => {
        setLoading(true);
        try {
          const response = await request.get(
            `account/payments/?is_student=false${
              selectedBranch ? `&teacher__branch=${selectedBranch}` : ""
            }${selectedGroup ? `&group=${selectedGroup}` : ""}`
          );
          setPayments(response.data.results);
        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          setLoading(false);
        }
      };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await request.get("group/groups/");
      setGroups(response.data.results);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateOrUpdatePayment = async (values: any) => {
    try {
      values.date = [
        moment(values.date.from_date).valueOf(),
        moment(values.date.to_date).valueOf(),
      ];
      if (values.teacher && typeof values.teacher === "object") {
        values.teacher = values.teacher.value;
      }

      if (editId) {
        await request.put(`account/payment-update/${editId}/`, values);
      } else {
        await request.post("account/payment-create/", values);
      }

      fetchPayments();
      setModalVisible(false);
      form.resetFields();
      setEditId(null);
    } catch (error) {
      console.error("Error creating or updating payment:", error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await request.get(`account/payment/${id}/`);
      const payment = response.data;
      form.setFieldsValue({
        group: payment.group.id,
        teacher: {
          label: `${payment?.teacher?.first_name} ${payment?.teacher?.last_name}`,
          value: payment?.teacher?.id,
        },
        price_sum: payment.price_sum,
        date: [
          moment(payment?.date?.from_date).format("MM/DD/YYYY HH:mm:ss"),
          moment(payment?.date?.to_date).format("MM/DD/YYYY HH:mm:ss"),
        ],
      });
      setSelectedGroup(payment.group);
      setEditId(id);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };


  



  const handleGroupChange = (value: number) => {
    setSelectedGroup(value);
  };

  const handleBranchChange = (value: number) => {
    setSelectedBranch(value);
  };
  console.log(selectedGroup)
  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Ism Familiya",
      dataIndex: "teacher",
      render: (teacher: any) => `${teacher?.first_name} ${teacher?.last_name}`,
      key: "teacher",
    },
    {
      title: "Guruh nomi",
      dataIndex: "group",
      render: (group: any) => group?.name,
      key: "name",
    },
    {
      title: "To'lov miqdori",
      dataIndex: "price_sum",
      render: (text: any, record: any) => `${text} / ${record.group?.price}`,
      key: "price_sum",
    },
    {
      title: "To'langan sana",
      dataIndex: "paid_time",
      render: (paid_time: any) => moment(paid_time).format("YYYY-MM-DD"),
      key: "paid_time",
    },
    {
      title: "sanadan",
      dataIndex: "from_date",
      key: "from_date",
    },
    {
      title: "sanagacha",
      dataIndex: "to_date",
      key: "to_date",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(id)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => showDeleteConfirm(id)}>
            delete
          </Button>
        </Space>
      ),
    },
  ];



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
         fetchPayments();
       } catch (err) {
         console.log(err);
       }
     },
     [fetchPayments]
   );



  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      const datas = res.data.results;
      console.log(datas);
      setBranches(datas);
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    getBranches();
  }, [getBranches]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = payments.filter((item) =>
    `${item.teacher?.first_name} ${item.teacher?.last_name}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-center font-medium">O'qituvchilar to'lovi</h1>

        <Select
          placeholder="Branch bo'yicha filtrlash"
          onChange={handleBranchChange}
          style={{ width: 200 }}
          allowClear
        >
          {branches.map((branch) => (
            <Option key={branch.id} value={branch.id}>
              {branch.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Guruh bo'yicha filtrlash"
          onChange={handleGroupChange}
          style={{ width: 200 }}
          allowClear
        >
          {groups.map((group) => (
            <Option key={group.id} value={group.id}>
              {group.name}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Search by teacher name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          className="mb-2"
          onClick={() => setModalVisible(true)}
        >
          To'lov qo'shish
        </Button>
      </div>
      <Modal
        title={editId ? "To'lovni tahrirlash" : "To'lov qo'shish"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditId(null);
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            handleCreateOrUpdatePayment(values);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="group"
            label="Guruh nomi"
            rules={[{ required: true, message: "Guruh nomini tanlang" }]}
          >
            <Select onChange={handleGroupChange}>
              {groups.map((group) => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher"
            label="O'qituvchi"
            rules={[{ required: true, message: "O'qituvchi tanlang" }]}
          >
            <Select>
              {selectedGroup && (
                <Option
                  key={selectedGroup?.teacher?.id}
                  value={selectedGroup?.teacher?.id}
                >
                  {`${selectedGroup?.teacher?.first_name} ${selectedGroup?.teacher?.last_name}`}{" "}
                  <span className="text-green">o'qituvchi</span>
                </Option>
              )}
              {selectedGroup?.sub_teacher && (
                <Option
                  key={selectedGroup?.sub_teacher?.id}
                  value={selectedGroup?.sub_teacher?.id}
                >
                  {`${selectedGroup?.sub_teacher?.first_name} ${selectedGroup?.sub_teacher?.last_name}`}{" "}
                  <span className="text-green">yordamchi o'qituvchi</span>
                </Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="price_sum"
            label="To'lov miqdori"
            rules={[{ required: true, message: "To'lov miqdorini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <CRangePicker />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default SuperTeachersPayments;
