import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import Cookies from 'js-cookie';
import Axios from '../../AxiosInstance';
import { AxiosError } from 'axios';
import { CommentContext } from '../../context/CommentContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const CommentModal = ({ open = false, handleClose = () => {} }) => {
  const [textField, setTextField] = useState('');
  const { setStatus, setComments, comments } = useContext(CommentContext);
  const queryClient = useQueryClient();
  

  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);

  const fetchComments = async () => {
    const response = await Axios.get('/comment');
    return response.data;
  };

  const { data: fetchedComments } = useQuery('comments', fetchComments);

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments, setComments]);

  const addComment = async (newComment) => {
    const userToken = Cookies.get('UserToken');
    try {
      const response = await Axios.post('/comment', newComment, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // TODO: show status of error from AxiosError here
        setStatus({
          severity: 'error',
          msg: error.response.data.error
        });
      } else {
        // TODO: show status of other errors here
        setStatus({
          severity: 'error',
          msg: error.message
        });
      }
    }
  };

  const mutation = useMutation(addComment, {
    onSuccess: (data) => {
      setStatus({
        severity: 'success',
        msg: 'Comment added successfully',
      });
      queryClient.invalidateQueries('comments');
      setTextField('');
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        setStatus({
          severity: 'error',
          msg: error.response.data.error,
        });
      } else {
        setStatus({
          severity: 'error',
          msg: error.message,
        });
      }
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    mutation.mutate({ text: textField });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={(e) => handleAddComment(e)}>Submit</Button>
        </Box>
        <Box sx={{ overflowY: 'scroll', maxHeight: 'calc(400px - 2rem)' }}>
          {comments.map((comment) => (
            <Card key={comment.id} sx={{ p: '1rem', m: '0.5rem' }}>
              {comment.msg}
            </Card>
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
