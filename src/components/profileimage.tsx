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

const tailwindColors = [
  'bg-blue-400',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400'
];

const getColorFromName = (name: string) => {
  const secondLetter = name.length > 1 ? name[1] : name[0] || ' ';
  const colorIndex = (secondLetter || 'a').charCodeAt(0) % tailwindColors.length;
  return tailwindColors[colorIndex];
};

export const ProfileImage: FC<ProfileImageProps> = ({ user, size = 80 }) => {
  const name = user?.name || '';
  const initial = (name[0] || '?').toUpperCase();
  const colorClass = getColorFromName(name);
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          className={`border border-slate-300 ${colorClass}`}
        >
          <span style={{ color: '#fff', fontSize: `${Math.floor(size / 2)}px` }}>
            {initial}
          </span>
        </div>
      )}
    </>
  );
};
