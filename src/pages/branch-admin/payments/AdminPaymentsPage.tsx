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
  DatePicker,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { LIMIT } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { request } from "../../../request";
import usePayments from "../../../states/adminPayment";
import { SearchOutlined } from "@ant-design/icons";
import { useAuth } from "../../../states/auth";
const BranchPayments = () => {
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
  const { branchId } = useAuth();

  const [form] = useForm();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editId, setEditId] = useState(null); // State variable to hold the id
  const [teachers, setTeachers] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
   const [defaultType, setDefaultType] = useState(null)
  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      title: "Ism Familiya",
      render: (text) =>
        text.student?.first_name + " " + text.student?.last_name,
      key: "name",
    },
    {
      title: "Guruh nomi",
      render: (data: any) => data.group?.name,
      key: "name",
    },
    {
      title: "Boshlanish",
      render: (text) => text.from_date,
      key: "name",
    },
    {
      title: "Tugash",
      render: (text) => text.to_date,
      key: "name",
    },
    {
      title: "Kunlik",
      render: (text) => {
        const fromDate = new Date(text.from_date);
        const toDate = new Date(text.to_date);
        const differenceInTime = fromDate - toDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays + " " + "kun";
      },
      key: "name",
    },
    {
      title: "To'lov miqdori",
      render: (text) => text.price_sum + "/" + text.group?.price,
      key: "name",
    },
    {
      title: "To'langanlik",
      render: (text) => {
        const percentage = (text.price_sum / text.group?.price) * 100;
        return `${percentage.toFixed(2)}%`;
      },
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: number) => (
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
        </Space>
      ),
    },
  ];

  const editPayment = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`account/payment/${id}/`);
        console.log(data);
        setDefaultType(data.date);
        const formattedData = {
          id: data.id,
          price_sum: data.price_sum,
          group: data.group?.name,
          monthly: data.monthly,
          student: data.student,
          date: [data.date[0]?.from_date, data.date[1]?.to_date],
          branch: branchId,
        };

        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form, branchId]
  );

  const handleForm = async (formData: any) => {
    try {
      const values = await formData.validateFields();
      const dataToSend = {
        price_sum: values.price_sum,
        student: values?.student,
        group: values.group,
        date: [values.date[0].valueOf(), values.date[1].valueOf()],
      };
      const branch = branchId;
      const updateData = { ...dataToSend, branch };

      if (editId) {
        await request.put(`account/payment-update/${editId}/`, updateData);
      } else {
        await request.post("account/payment-create/", updateData);
      }

      setEditId(null);
      handleCancel();
      getData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStudents = useCallback(async () => {
    try {
      const res = await request.get(
        `account/student-profiles/?branch=${branchId}`
      );
      setStudents(res.data.results);
    } catch (err) {
      console.log(err);
    }
  }, [branchId]);

  const getGroups = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/?branch=${branchId}`);
      setGroups(res.data.results);
    } catch (err) {
      console.log(err);
    }
  }, [branchId]);

  useEffect(() => {
    getStudents();
    getGroups();
  }, [getStudents, getGroups]);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    SearchSkills(value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const handleGroupSelectChange = (value) => {
    setSelectedGroupName(value);
    const filtered = students.filter((student) => student.group.id === value);
    console.log(students)
    setFilteredStudents(filtered);
  };

  const handleChangeBranch = (value) => {
    setSelectedBranch(value);
  };

  const handleChangeStaff = (value) => {
    setSelectedStaff(value);
  };

  useEffect(() => {
    getData(selectedStaff);
  }, [getData, selectedStaff]);

  const [teacherOptions, setTeacherOptions] = useState([]);
  useEffect(() => {
    const teacherOptions = teachers
      .filter((value) => value?.user.roles === "teacher")
      .map((value) => ({
        label: `${value?.first_name} ${value?.last_name}`,
        value: value.id,
      }));
    setTeacherOptions(teacherOptions);
  }, [teachers]);

  const getTeachers = useCallback(async () => {
    try {
      const res = await request.get(
        `account/staff-profiles/?branch=${branchId}`
      );
      setTeachers(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, [branchId]);

  useEffect(() => {
    getTeachers();
    getStudents();
  }, [getTeachers, getStudents]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>To'lovlar boshqaruvi</h3>
        <Button
          onClick={() => showModal(form)}
          type="primary"
          style={{ backgroundColor: "#264653", borderRadius: 5 }}
        >
          To'lov yaratish
        </Button>
      </div>
      <Space style={{ margin: "15px 0" }}>
        <Input
          placeholder="Qidiruv..."
          value={selectedGroupName}
          onChange={(e) => handleGroupSelectChange(e.target.value)}
          style={{ width: 200 }}
          suffix={<SearchOutlined />}
        />
        <Select
          placeholder="Guruhni tanlang"
          onChange={handleGroupSelectChange}
          allowClear
        >
          {groups.map((group) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="O'qituvchi tanlang"
          onChange={handleChangeStaff}
          allowClear
        >
          {teacherOptions.map((teacher) => (
            <Select.Option key={teacher.value} value={teacher.value}>
              {teacher.label}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={toggleSearch}>
          {isSearchOpen ? "Yopish" : "Izlash"}
        </Button>
      </Space>
      <Table
        loading={loading}
        className="table"
        style={{ width: "1300px" }}
        pagination={false}
        dataSource={data}
        columns={columns}
      />
      {total > LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => handlePage(page, navigate)}
        />
      ) : null}
      <Modal
        open={isModalOpen}
        title="Title"
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}
      >
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={() => handleForm(form)}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="To'lov miqdori"
            name="price_sum"
            rules={[{ required: true, message: "Please fill!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Guruh"
            name="group"
            rules={[{ required: true, message: "Guruhni kiriting!" }]}
          >
            <Select
              showSearch
              placeholder="Gruruhni tanlang"
              optionFilterProp="children"
              onChange={handleGroupSelectChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={groups.map((value) => ({
                value: value.id,
                label: value.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="O'quvchi"
            name="student"
            rules={[{ required: true, message: "Please input skill name!" }]}
          >
            <Select
              showSearch
              placeholder="O'quvchini tanlang"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={filteredStudents.map((value) => ({
                value: value.id,
                label: value.last_name + " " + value.first_name,
              }))}
            />
          </Form.Item>
          <Form.Item
            className="dataPickerForm"
            label="Oy uchun"
            name="date"
            rules={[{ required: true, message: "Oyini tanlang!" }]}
          >
            <DatePicker.RangePicker/>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              {editId ? "Saqlash" : "Yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default BranchPayments;
