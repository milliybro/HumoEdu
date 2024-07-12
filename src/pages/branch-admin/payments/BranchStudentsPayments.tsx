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

// import { LIMIT } from "../../../constants";
import {  useParams } from "react-router-dom";
import { request } from "../../../request";
import usePayments from "../../../states/adminPayment";
// import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import CRangePicker from "../../../utils/datapicker";
import moment from "moment";

const AdminPayments = () => {
  const {
    total,
    isModalOpen,
    showModal,
    handleCancel,
    handlePage,
  } = usePayments();

  const { branchId } = useParams();
  console.log(branchId, "branchId");

  const [form] = useForm();
  const [student, setStudent] = useState([]);
  const [mygroup, setMyGroup] = useState([]);
  const [editId, setEditId] = useState(null); 
  // const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [data, setData] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request.get(
        `account/payments/?is_student=true${selectedGroup ? `&group=${selectedGroup}` : ""}`
      );
      const responseData = res.data;
      setData(responseData.results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [ selectedGroup]);

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
      render: (text) =>text?.student?.first_name + " " + text?.student?.last_name,
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
        const formattedData = {
          id: data.id,
          price_sum: data.price_sum,
          student: {
              label: `${data?.student?.first_name} ${data?.student?.last_name}`,
              value: data?.student?.id,
          },
          
          group: data.group.id,
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
        if (values.student && typeof values.student === "object") {
          values.student = values.student.value; // Use the value (ID) of the student object
        }
      if (editId) {
        values.id = editId;

        await request.patch(`account/payment-update/${editId}/`, values);
        setEditId(null);
        handleCancel();
        fetchData();
      } else {
        await request.post("account/payment-create/", values);
        setEditId(null);
        handleCancel();
        fetchData(); 
      }
      // Refresh data after adding new staff or editing existing one
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
  }, [groupId]);

  const getGroup = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      const data = res.data.results;
      setMyGroup(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (groupId !== null) {
      getStudent(groupId);
    }
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
 

  // const handleChangeBranch = (value) => {
  //   setSelectedBranch(value);
  // };

  // const handleChangeStaff = (value) => {
  //   setSelectedStaff(value);
  // };
  const onChangeGroup = (value: number) => {
    setSelectedGroup(value);
  };

  useEffect(() => {
    fetchData(); // fetchData funksiyasini o'zgargan
  }, [ selectedGroup]); 

  // const [teacherOptions, setTeacherOptions] = useState([]);
  // useEffect(() => {
  //   const teacherOptions = teacher
  //     .filter((value) => value?.user.roles === "teacher")
  //     .map((value) => ({
  //       label: `${value?.first_name} ${value?.last_name}`,
  //       value: value.id,
  //     }));
  //   setTeacherOptions(teacherOptions);
  // }, [teacher]);


  //////// search input  /////////////
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
      <div className="flex items-center justify-between my-4">
        <h1 className="font-medium">O'quvchilar to'lovlari</h1>
        <Input
          placeholder="Search by student name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          style={{ width: 200, marginRight: 10 }}
          placeholder="Select Group"
          onChange={onChangeGroup}
          allowClear
        >
          {mygroup.map((group: any) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          onClick={() => showModal(form)}
          type="primary"
        >
          To'lov qo'shish
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
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
          <Button key="submit" type="primary" onClick={() => handleForm(form)}>
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
          <Form.Item name="student" label="student">
            <Select
              showSearch
              placeholder="student"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
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

export default AdminPayments;
