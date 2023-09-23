import React, { FC, useState, useEffect } from 'react';
import { RouterOutputs } from '~/utils/api';
import Image from 'next/image';
import Tooltip from './reusables/tooltip';


interface SessionUserType {
  id: string;
  username: string;
  name?: string | null;
  email?: string | null;
  image?: string | null; 
}

type ProfileImageProps = {
  user?: RouterOutputs["users"]["getUserByUserId"]["user"] | SessionUserType;
  size?: number;
  showUsernameOnHover?: boolean;
};

const tailwindColors = [
  'bg-blue-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-pink-500'
];

const getColorFromName = (name: string) => {
  const secondLetter = name.length > 1 ? name[1] : name[0] ?? ' ';
  const colorIndex = (secondLetter ?? 'a').charCodeAt(0) % tailwindColors.length;
  return tailwindColors[colorIndex];
};

export const ProfileImage: FC<ProfileImageProps> = ({ user, size = 80, showUsernameOnHover = false}) => {
  const email = user?.email ?? '';
  const username = user?.username ?? 'Unknown User';
  const initial = (email[0] ?? '?').toUpperCase();
  const colorClass = getColorFromName(email);
  const imageUrl = user?.image;

  return (
    <Tooltip content={username}>
      {imageUrl ? (
        <Image
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
    </Tooltip>
  );
};
