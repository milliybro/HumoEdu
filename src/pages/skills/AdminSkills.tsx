import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Row, Col } from "antd";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./style.scss";

import { useNavigate } from "react-router-dom";
import { LIMIT } from "../../constants";
import useSkills from "../../states/adminSkills";
import { request } from "../../request";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";


const { confirm } = Modal;

const EducationPageAdmin = () => {
  const {
    total,
    loading,
    isModalOpen,
    //  active,
    //  totalPaginate,
    data,
    page,
    getData,
    SearchSkills,
    showModal,
    handleCancel,
    handlePage,
  } = useSkills();

  const [form] = useForm();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null); // State variable to hold the id
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
      title: "Fan nomi",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: number) => {
        return (
          <Space size="middle">
            <Button
              style={{ backgroundColor: "#264653" }}
              onClick={() => {
                showModal(form);
                setEditId(id); // Set the id when Edit button is clicked
                editScience(id);
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
        );
      },
    },
  ];

  const editScience = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`group/science/${id}/`);
        const formattedData = {
          id: data.id,
          name: data.name,
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
    try {
      const values = await formData.validateFields();
      if (editId) {
        values.id = editId;
        await request.put(`group/science-update/${editId}/`, values);
      } else {
        await request.post("group/science-create/", values);
      }
      setEditId(null);
      handleCancel();
      getData(); // Refresh data after adding new staff or editing existing one
    } catch (err) {
      console.error(err);
    }
  };

  ////// delete modal for delete funtion start //////

  const showDeleteConfirm = (id:number) => {
    confirm({
      title: "Bu fanni ro'yhatdan o'chirishni hohlaysizmi ?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amalni ortga qaytarib bo‘lmaydi.",
      okText: "ha",
      okType: "danger",
      cancelText: "ortga",
      onOk() {
        deleteScience(id);
      },
      onCancel() {
        setDeleteModal(false);
      },
    });
  };

  ////// delete modal for delete funtion end //////

  ///////// delete function  start ///////
  const deleteScience = useCallback(
    async (id: number) => {
      setDeleteModal(true);
      try {
        await request.delete(`group/science-delete/${id}/`);
        getData(); // Refresh data after deletion
      } catch (err) {
        console.log(err);
      } finally {
        setDeleteModal(false);
      }
    },
    [getData]
  );

  ///////// delete function  end ///////

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Fragment>
      <Table
        loading={loading}
        className="table"
        style={{ width: "1500px" }}
        title={() => (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h1 className="font-medium text-2xl">
                  Fanlar <span className="text-green-500">({total})</span>{" "}
                </h1>
              </Col>
              <div
                style={{ display: "flex", alignItems: "center", gap: "30px" }}
              >
                <Col>
                  <div className="relative flex items-center bg-blue-500 p-1 rounded-full px-2">
                    <Input
                      onChange={(e) => {
                        SearchSkills(e);
                      }}
                      className={`transition-width duration-300 ease-in-out ${
                        isSearchOpen ? "w-64 px-4 py-1" : "w-0 px-0 py-1"
                      } bg-white rounded-md shadow-md outline-none`}
                      placeholder="Search..."
                      style={{ opacity: isSearchOpen ? 1 : 0 }}
                    />
                    <a
                      href="#"
                      onClick={toggleSearch}
                      className="ml-2 mr-2 text-white"
                    >
                      {isSearchOpen ? <CloseOutlined /> : <SearchOutlined />}
                    </a>
                  </div>
                </Col>
                <Col>
                  <Button
                    className="text-center"
                    type="primary"
                    onClick={() => showModal(form)}
                  >
                    Fan qo'shish
                  </Button>
                </Col>
              </div>
            </Row>
          </>
        )}
        pagination={false}
        dataSource={data}
        columns={columns}
        rowKey="id"
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
      {/* {totalPaginate > 1 ? (
        <section id="pagination">
          <div className="container">
            <div className="pagination-btns">
              <button
                disabled={active === 1 ? true : false}
                onClick={() => {
                  setActive(active - 1);
                }}
              >
                {"<"}
              </button>
              <span>{active}</span>
              <button
                disabled={totalPaginate === active ? true : false}
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                {">"}
              </button>
            </div>
          </div>
        </section>
      ) : null} */}
      <Modal
        open={isModalOpen}
        title="Fanlar"
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
            label="Fan nomi"
            name="name"
            rules={[
              {
                required: true,
                message: "Fanni kiriting!",
              },
            ]}
          >
            <Input />
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

export default EducationPageAdmin;
