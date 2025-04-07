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
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [page, searchType, searchKeyword, status]);

  const fetchReports = async () => {
    try {
      const params = {
        page: page - 1,
        size: 10,
        searchType,
        searchKeyword,
        status
      };

      const response = await axios.get('/api/admin/reports', { params });
      setReports(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('신고 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/status`, { status: newStatus });
      fetchReports();
    } catch (error) {
      console.error('신고 상태 변경에 실패했습니다:', error);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('정말로 이 신고를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/admin/reports/${reportId}`);
        fetchReports();
      } catch (error) {
        console.error('신고 삭제에 실패했습니다:', error);
      }
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return '대기';
      case 1:
        return '처리중';
      case 2:
        return '완료';
      default:
        return '알 수 없음';
    }
  };

  const getReasonLabel = (reason) => {
    switch (reason) {
      case 1:
        return '스팸/홍보';
      case 2:
        return '혐오 발언';
      case 3:
        return '허위 정보';
      default:
        return '기타';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          신고 관리
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
              <MenuItem value="review">리뷰 내용</MenuItem>
              <MenuItem value="reporter">신고자</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="검색어"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ flexGrow: 1 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>처리 상태</InputLabel>
            <Select
              value={status}
              label="처리 상태"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="0">대기</MenuItem>
              <MenuItem value="1">처리중</MenuItem>
              <MenuItem value="2">완료</MenuItem>
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
                <TableCell>신고된 리뷰</TableCell>
                <TableCell>신고자</TableCell>
                <TableCell>신고 사유</TableCell>
                <TableCell>신고 일시</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.reportId}>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleViewDetails(report)}
                    >
                      리뷰 내용 보기
                    </Button>
                  </TableCell>
                  <TableCell>{report.reporterId}</TableCell>
                  <TableCell>{getReasonLabel(report.reason)}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusLabel(report.status)}</TableCell>
                  <TableCell>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.reportId, e.target.value)}
                        size="small"
                      >
                        <MenuItem value={0}>대기</MenuItem>
                        <MenuItem value={1}>처리중</MenuItem>
                        <MenuItem value={2}>완료</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(report.reportId)}
                      sx={{ ml: 1 }}
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>신고 상세 정보</DialogTitle>
          <DialogContent>
            {selectedReport && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  리뷰 내용
                </Typography>
                <Typography paragraph>
                  {selectedReport.reviewContent}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  신고 사유
                </Typography>
                <Typography paragraph>
                  {getReasonLabel(selectedReport.reason)}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  추가 설명
                </Typography>
                <Typography paragraph>
                  {selectedReport.details || '없음'}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>닫기</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ReportManagement; 