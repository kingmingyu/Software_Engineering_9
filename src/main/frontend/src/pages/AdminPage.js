import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

import Header from '../component/Header';
import Logo from '../component/Logo'


function AdminPage() {
    const [vocaList, setVocaList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newVoca, setNewVoca] = useState({ spelling: '', meaning: '' });
    const [editingVoca, setEditingVoca] = useState(null);

    useEffect(() => {
        loadVocaList();
    }, [currentPage]);

    const loadVocaList = async () => {
        try {
            const response = await axios.get(`/api/voca/list?page=${currentPage}&size=40`);
            setVocaList(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('단어 목록 로딩 실패:', error);
            alert('단어 목록을 불러오는데 실패했습니다.');
        }
    };

    const handleAddVoca = async () => {
        if (!newVoca.spelling || !newVoca.meaning) {
            alert('단어와 의미를 모두 입력해주세요.');
            return;
        }

        try {
            await axios.post('/api/voca', newVoca);
            setNewVoca({ spelling: '', meaning: '' });
            loadVocaList();
        } catch (error) {
            console.error('단어 추가 실패:', error);
            alert('단어 추가에 실패했습니다.');
        }
    };

    const handleDeleteVoca = async (id) => {
        if (!window.confirm('정말로 이 단어를 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axios.delete(`/api/voca/${id}`);
            loadVocaList();
        } catch (error) {
            console.error('단어 삭제 실패:', error);
            alert('단어 삭제에 실패했습니다.');
        }
    };

    const handleUpdateVoca = async () => {
        if (!editingVoca || !editingVoca.spelling || !editingVoca.meaning) {
            alert('단어와 의미를 모두 입력해주세요.');
            return;
        }

        try {
            await axios.put(`/api/voca/${editingVoca.id}`, {
                spelling: editingVoca.spelling,
                meaning: editingVoca.meaning
            });
            setEditingVoca(null);
            loadVocaList();
        } catch (error) {
            console.error('단어 수정 실패:', error);
            alert('단어 수정에 실패했습니다.');
        }
    };

    return (
        <div className="admin-container">
            <Header title="VOCAcino 관리자 페이지" />
            <Logo />

            <div className="admin-content">
                <div className="add-voca-section">
                    <h2>Day {currentPage + 1}</h2>
                    <div className="add-voca-form">
                        <input
                            type="text"
                            placeholder="영어 단어"
                            value={newVoca.spelling}
                            onChange={(e) => setNewVoca({...newVoca, spelling: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="단어 의미"
                            value={newVoca.meaning}
                            onChange={(e) => setNewVoca({...newVoca, meaning: e.target.value})}
                        />
                        <button onClick={handleAddVoca}>단어 추가하기</button>
                    </div>
                </div>

                <div className="voca-list">
                    <table>
                        <thead>
                            <tr>
                                <th>영어 단어</th>
                                <th>단어 뜻</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vocaList.map((voca) => (
                                <tr key={voca.id}>
                                    {editingVoca && editingVoca.id === voca.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingVoca.spelling}
                                                    onChange={(e) => setEditingVoca({
                                                        ...editingVoca,
                                                        spelling: e.target.value
                                                    })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingVoca.meaning}
                                                    onChange={(e) => setEditingVoca({
                                                        ...editingVoca,
                                                        meaning: e.target.value
                                                    })}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={handleUpdateVoca}>저장</button>
                                                <button onClick={() => setEditingVoca(null)}>취소</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{voca.spelling}</td>
                                            <td>{voca.meaning}</td>
                                            <td>
                                                <button onClick={() => setEditingVoca(voca)}>수정</button>
                                                <button onClick={() => handleDeleteVoca(voca.id)}>삭제</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                    >
                        이전 Day
                    </button>
                    <span>Day {currentPage + 1}</span>
                    <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage >= totalPages - 1}
                    >
                        다음 Day
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;