import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api'; // Assuming this is where your tRPC hooks are
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { mutateAsync } = api.auth.verifyEmail.useMutation();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      mutateAsync({ token })
        .then(() => {
          toast.success('Email Verified Successfully');
          router.push('/');  // redirect to home page or wherever you like
        })
        .catch((error) => {
          toast.error(`An error occurred: ${error.message}`);
        });
    }
  }, []);

  return (
    <div>
      Verifying your email...
    </div>
  );
};

export default VerifyEmail;
