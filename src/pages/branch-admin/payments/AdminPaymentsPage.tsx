import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Flex, Input, Modal, Space, Table, Pagination, Select } from "antd";
import { useForm } from "antd/es/form/Form";

// import "./style.scss";
import { LIMIT } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../../../request";
import usePayments from "../../../states/adminPayment";
import { SearchOutlined } from "@ant-design/icons";
import CRangePicker from "../../../utils/datapicker";
const BranchPayments = () => {
  const { total, loading, isModalOpen, data, page, getData, editData, deleteData, SerachSkills, showModal, handleCancel, handleOk, handlePage } = usePayments();

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



  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      title: "Ism Familiya",
      render: (text) => text.student.first_name + " " + text.student.last_name,
      key: "name",
    },
    {
      title: "Guruh nomi",
      render: (data: any) => data.group?.name,
      key: "name",
    },
    {
      title: "Boshlanish",
      // dataIndex: "student.username",
      render: (text) => text.from_date,
      key: "name",
    },
    {
      title: "Tugash",
      // dataIndex: "student.username",
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
      // dataIndex: "student.username",
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
            onClick={() => deletePayment(id)}
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
    async (id: any) => {
      try {
        const { data } = await request.get(`account/payment/${id}/`);
        const formattedData = {
          id: data.id,
          price_sum: data.price_sum,
          student: data.student,
          group: data.group,
          mothly: data.mothly,
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
      if (editId) {
        values.id = editId;
        await request.put(`account/payment-update/${editId}/`, values);
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
  const getStudent = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profiles/`);
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

  const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
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
    getData(selectedBranch,  selectedStaff);
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
    getBranches()
  }, [ getTeacher, getStudent, getBranches]);

  const handleGroupSelectChange = (value) => {
    setSelectedGroupName(value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };



  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>To'lovlar boshqaruvi</h3>
        <Button onClick={() => showModal(form)} type="primary" style={{ backgroundColor: "#264653", borderRadius: 5 }}>
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
        <Select placeholder="Fillial tanlang" onChange={handleChangeBranch} allowClear>
          {branch.map((value) => (
            <Select.Option key={value.id} value={value.id}>
              {value.name}
            </Select.Option>
          ))}
        </Select>
        <Select placeholder="Guruhni tanlang" onChange={handleChangeStaff} allowClear>
          {mygroup.map((group) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
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
        <Button onClick={toggleSearch}>{isSearchOpen ? "Yopish" : "Izlash"}</Button>
      </Space>
      <Table
        loading={loading}
        className="table"
        
        pagination={false}
        dataSource={data} // corrected from 'experience' to 'data'
        columns={columns}
      />
      {total > LIMIT ? <Pagination className="pagination" total={total} pageSize={LIMIT} current={page} onChange={(page) => handlePage(page, navigate)} /> : null}
      <Modal
        visible={isModalOpen} // corrected from 'open' to 'visible'
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
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={() => handleForm(form)}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="To'lov miqdori"
            name="price_sum"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="O'quvchi"
            name="student"
            rules={[
              {
                required: true,
                message: "Please input skill name!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="O'quvchini tanlang"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={student.map((value) => ({
                value: value.id,
                label: value.last_name + " " + value.first_name,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Guruh"
            name="group"
            rules={[
              {
                required: true,
                message: "Guruhni kiriting!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="O'quvchini tanlang"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={mygroup.map((value) => ({
                value: value.id,
                label: value.name,
              }))}
            />
          </Form.Item>

          <Form.Item
          className="dataPickerForm"
            label="Oy uchun"
            name="date"
            rules={[
              {
                required: true,
                message: "oyni kiriting!",
              },
            ]}
          >
            <CRangePicker  />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button
              style={{
                width: "100%",
              }}
              type="primary"
              htmlType="submit"
            >
              {editId ? "Saqlash" : "Yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default BranchPayments;
