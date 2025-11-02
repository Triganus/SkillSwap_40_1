import React from 'react';
import styles from './InfoBlock.module.scss';

export interface InfoBlockProps {
  image: string;
  title: string;
  description: string;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({ image, title, description }) => {
  return (
    <div className={styles.container}>
      <img src={image} alt="" className={styles.image} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.desc}>{description}</p>
    </div>
  );
};
