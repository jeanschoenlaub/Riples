import React from 'react';
import type { FC } from 'react';
import Image from 'next/image';
import { Tooltip } from '.';


type ProfileImageProps = {
  username: string | null;
  name: string | null;
  email: string | null;
  image?: string | null; 
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

export const ProfileImage: FC<ProfileImageProps> = ({ username, name, email, image, size = 80, showUsernameOnHover = false}) => {
  const initial = (email?.[0] ?? '?').toUpperCase();
  const colorClass = getColorFromName(email ?? "?");
  const imageUrl = image;

  const content = (
    imageUrl ? (
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
    )
  );

  return (
    showUsernameOnHover
      ? <Tooltip content={username ?? ""}>{content}</Tooltip>
      : content
  );
};
 
