import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [approveStatus, setApproveStatus] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [page, searchType, searchKeyword, approveStatus]);

  const fetchReviews = async () => {
    try {
      const params = {
        page: page - 1,
        size: 10,
        searchType,
        searchKeyword,
        approveStatus
      };

      const response = await axios.get('/api/admin/reviews', { params });
      setReviews(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/approve`);
      fetchReviews();
    } catch (error) {
      console.error('리뷰 승인에 실패했습니다:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/admin/reviews/${reviewId}`);
        fetchReviews();
      } catch (error) {
        console.error('리뷰 삭제에 실패했습니다:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          리뷰 관리
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>검색 유형</InputLabel>
            <Select
              value={searchType}
              label="검색 유형"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="hospital">병원명</MenuItem>
              <MenuItem value="user">작성자</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="검색어"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ flexGrow: 1 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>승인 상태</InputLabel>
            <Select
              value={approveStatus}
              label="승인 상태"
              onChange={(e) => setApproveStatus(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="pending">대기</MenuItem>
              <MenuItem value="approved">승인</MenuItem>
              <MenuItem value="rejected">거부</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained">
            검색
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>병원명</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>평점</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.reviewId}>
                  <TableCell>{review.hospitalName}</TableCell>
                  <TableCell>{review.userId}</TableCell>
                  <TableCell>{review.content}</TableCell>
                  <TableCell>{review.score}</TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {review.approveYn === 0 && '대기'}
                    {review.approveYn === 1 && '승인'}
                    {review.approveYn === 2 && '거부'}
                  </TableCell>
                  <TableCell>
                    {review.approveYn === 0 && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(review.reviewId)}
                        sx={{ mr: 1 }}
                      >
                        승인
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(review.reviewId)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewManagement; 