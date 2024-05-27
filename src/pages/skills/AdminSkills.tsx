import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Flex, Input, Modal, Space, Table, Pagination, Row, Col } from "antd";
import { useForm } from "antd/es/form/Form";

import "./style.scss";

import { useNavigate } from "react-router-dom";
import { LIMIT } from "../../constants";
import useSkills from "../../states/adminSkills";
import { request } from "../../request";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
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
    editData,
    deleteData,
    SerachSkills,
    //  setActive,
    showModal,
    handleCancel,
    handleOk,
    handlePage,
  } = useSkills();

  const [form] = useForm();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null); // State variable to hold the id

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      title: "Fan nomi",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: string) => {
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
              onClick={() => deleteScience(id)}
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
    async (id: any) => {
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

  const deleteScience = useCallback(
    async (id) => {
      try {
        await request.delete(`group/science-delete/${id}/`);
        getData(); // Refresh data after deletion
      } catch (err) {
        console.log(err);
      }
    },
    [getData]
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };


  return (
    <Fragment>
      <Table
        loading={loading}
        className="table"
        title={() => (
          <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h1>Fanlar ({total})</h1>
              </Col>
              <div style={{ display: "flex", alignItems: "center", gap: "70px" }}>
                <Col>
                  <div className="search-box">
                    <Input
                      onChange={(e) => {
                        SerachSkills(e);
                        console.log(e.target.value);
                      }}
                      className={isSearchOpen ? "searchInput open" : "searchInput"} // Apply different class based on isSearchOpen state
                      placeholder="Search..."
                    />
                    <a href="#" onClick={toggleSearch}>
                      {isSearchOpen ? <CloseOutlined style={{ color: "white" }} /> : <SearchOutlined />}
                    </a>
                  </div>
                </Col>
                <Col>
                  <Button className="Add" type="primary" onClick={() => showModal(form)}>
                    <div className="center">
                      <button className="btn">
                        <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                          <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                          <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                        </svg>
                        <span>Fan yaratish</span>
                      </button>
                    </div>
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

      {total > LIMIT ? <Pagination className="pagination" total={total} pageSize={LIMIT} current={page} onChange={(page) => handlePage(page, navigate)} /> : null}
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
