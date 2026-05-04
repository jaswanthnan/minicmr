import React, { useMemo, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, Space, message, Avatar, Tag, Popconfirm, Popover, Typography } from "antd";

const { Text } = Typography;
import { RobotOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import SmartMatchModal from "./SmartMatchModal";

ModuleRegistry.registerModules([AllCommunityModule]);

function CandidateTable({ candidates, refresh, onEdit, onSelectionChange }) {
    const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const onSelectionChanged = (event) => {
        const selectedRows = event.api.getSelectedRows();
        if (onSelectionChange) {
            onSelectionChange(selectedRows);
        }
    };

    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/candidates/${id}`);
            message.success("Candidate deleted");
            refresh();
        } catch (err) {
            message.error("Failed to delete candidate");
        }
    };

    const handleOpenMatch = (candidate) => {
        setSelectedCandidate(candidate);
        setIsMatchModalVisible(true);
    };

    const colDefs = useMemo(() => [
        {
            width: 50,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            pinned: 'left',
            lockPosition: true,
            suppressMenu: true
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellRenderer: (params) => (
                <Space>
                    <Avatar size="small" style={{ backgroundColor: '#87d068' }}>{params.value ? params.value[0].toUpperCase() : 'U'}</Avatar>
                    {params.value}
                </Space>
            )
        },
        { field: "email", headerName: "Email", flex: 1 },
        {
            field: "skills",
            headerName: "Skills",
            flex: 2,
            cellRenderer: (params) => {
                const skills = params.data.skills || [];
                if (skills.length === 0) return "-";

                const visibleSkills = skills.slice(0, 3);
                const extraSkills = skills.slice(3);
                const remainingCount = extraSkills.length;

                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', height: '100%' }}>
                        {visibleSkills.map((skill, i) => (
                            <Tag
                                key={i}
                                style={{
                                    margin: 0,
                                    borderRadius: '6px',
                                    background: '#f5f3ff',
                                    border: 'none',
                                    color: '#7c3aed',
                                    fontWeight: 600,
                                    fontSize: '11px'
                                }}
                            >
                                {skill}
                            </Tag>
                        ))}
                        {remainingCount > 0 && (
                            <Popover
                                title={<Text strong style={{ fontSize: '13px' }}>Extra Skills</Text>}
                                content={
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '280px', padding: '4px 0' }}>
                                        {extraSkills.map((s, idx) => (
                                            <Tag key={idx} style={{
                                                margin: 0,
                                                borderRadius: '6px',
                                                background: '#f5f3ff',
                                                border: 'none',
                                                color: '#7c3aed',
                                                fontWeight: 600,
                                                fontSize: '11px'
                                            }}>
                                                {s}
                                            </Tag>
                                        ))}
                                    </div>
                                }
                                trigger="hover"
                                placement="top"
                            >
                                <Tag
                                    style={{
                                        margin: 0,
                                        borderRadius: '6px',
                                        background: '#f1f5f9',
                                        border: 'none',
                                        color: '#64748b',
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    +{remainingCount}
                                </Tag>
                            </Popover>
                        )}
                    </div>
                );
            }
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            cellRenderer: (params) => {
                const status = params.value?.toUpperCase();
                let color = 'default';
                if (status === 'HIRED' || status === 'SELECTED') color = 'success';
                else if (status === 'APPLIED' || status === 'INTERVIEW' || status === 'ACTIVE') color = 'processing';
                else if (status === 'REJECTED') color = 'error';

                return <Tag color={color} style={{ borderRadius: '4px', textTransform: 'capitalize' }}>{params.value || 'Pending'}</Tag>;
            }
        },
        {
            headerName: "Actions",
            cellRenderer: (params) => (
                <Space>
                    <Button
                        size="small"
                        type="text"
                        icon={<RobotOutlined style={{ color: '#8b5cf6' }} />}
                        onClick={() => handleOpenMatch(params.data)}
                    />
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined style={{ color: '#3b82f6' }} />}
                        onClick={() => onEdit(params.data)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this candidate?"
                        onConfirm={() => deleteCandidate(params.data._id || params.data.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
            flex: 1,
            pinned: 'right',
            lockPosition: true
        }
    ], []);

    return (
        <div className="ag-theme-quartz" style={{ width: "100%" }}>
            <AgGridReact
                rowData={candidates}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={20}
                rowSelection="multiple"
                suppressCellFocus={true}
                onSelectionChanged={onSelectionChanged}
                domLayout="autoHeight"
                rowHeight={55}
            />

            <SmartMatchModal
                visible={isMatchModalVisible}
                onClose={() => setIsMatchModalVisible(false)}
                candidate={selectedCandidate}
            />
        </div>
    );
}

export default CandidateTable;