import React, { FC } from 'react';

type UserData = {
  name?: string;
  image?: string;
  // Add other fields from RouterOutputs["users"]["getUserByUserId"] as needed
};

type ProfileImageProps = {
  user: UserData;
  size?: number;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const ProfileImage: FC<ProfileImageProps> = ({ user, size = 80 }) => {
  const randomColor = getRandomColor();
  const name = user?.name || '';
  const initial = name[0] || '?';
  const imageUrl = user?.image;

  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile Image"
          className="rounded-full border border-slate-300"
          width={size}
          height={size}
        />
      ) : (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: randomColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
          className="border border-slate-300"
        >
          <span style={{ color: '#fff', fontSize: `${Math.floor(size / 2)}px` }}>
            {initial}
          </span>
        </div>
      )}
    </>
  );
};
