import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Axios from '../../../AxiosInstance';
import { AxiosError } from 'axios';
import GlobalContext from '../../../Context/GlobalContext';
import Cookies from 'js-cookie';

const CommentCard = ({ comment = { id: -1, msg: '' } }) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.msg);
  const [error, setError] = useState({});
  const { setStatus } = useContext(GlobalContext);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    submit()
  }, [toggle]);
  const click = () =>{
    setToggle(!toggle)
  }
  const submit = useCallback( () => {
    if (functionMode === 'update') {
      // TODO implement update logic
      const userToken = Cookies.get('UserToken');
      Axios.patch('/comment',
      {
        text: msg,
        commentId: comment.id,
      },
      {
        headers: { Authorization: `Bearer ${userToken}`},
      }).then((response) => {
        if (response.data.success){
          setMsg(response.data.data.text);
          setStatus({
            severity: 'success', 
            msg: 'Update success'
          });
          console.log('update success');
          click();
        }
        else{
          console.log('Fail');
        }
      }).catch((error) => {
        if (error instanceof AxiosError && error.response) {
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      });

    } else if (functionMode === 'delete') {
      // TODO implement delete logic
      const userToken = Cookies.get('UserToken');
      Axios.delete('/comment',
      {
        headers: { Authorization: `Bearer ${userToken}`},
        data: { commentId: comment.id }
      }).then((response) => {
        if (response.data.success) {
          // set(() => msg.filter((n) => n.id !== comment.id));
          setMsg('');
          setStatus({
            severity: 'success', 
            msg: 'delete success'
          });
          //setMsg((data) => data.filter((c) => c.id !== comment.id));
          console.log('delete');
          //cancelAction();
        } else {
          console.log(error.message);
        }
      }).catch((error) => {
        if (error instanceof AxiosError && error.response) {
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      });
      
    } else {
      // TODO setStatus (snackbar) to error
      console.log('error');
    }
  }, [functionMode, msg]);

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{comment.msg}</Typography>
      ) : (
        <TextField sx={{ flex: 1 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;
