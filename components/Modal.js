import styles from './Modal.module.css';
import StacksLogoSuccess from '../public/images/stacksModalLogoSuccess.svg';
import StacksLogoError from '../public/images/stacksModalLogoError.svg';
import { signOut } from 'next-auth/react';

import { useState } from 'react';
import { useRouter } from 'next/router';

const Modal = (props) => {
	const { title, subParagraphOne, subParagraphTwo, link } = props;
	const [hide, setHide] = useState(true);
	const router = useRouter();

	return (
		<div className={hide ? styles.modalWrapper : styles.modalWrapperHide}>
			{title.toLowerCase() === 'success' || title.toLowerCase() === 'important' ? (
				<StacksLogoSuccess className={styles.stacksLogo} />
			) : (
				<StacksLogoError className={styles.stacksLogo} />
			)}
			<p
				className={
					title.toLowerCase() === 'success' || title.toLowerCase() === 'important'
						? styles.titleSuccess
						: styles.titleError
				}
			>
				{title}
			</p>
			<p className={styles.subParagraphOne}>{subParagraphOne}</p>
			{subParagraphTwo && <p className={styles.subParagraphTwo}>{subParagraphTwo}</p>}
			{link && <p className={styles.linkToIssue}>Click below to view on Github</p>}
			{title.toLowerCase() != 'important' ? (
				<a href={link} target="_blank" rel="external noopener noreferrer">
					{' '}
					<button
						onClick={() => {
							setHide(false);
							router.push('/');
							signOut();
						}}
					>
						{title === 'Important' ? 'Dismiss' : 'Confirm'}
					</button>
				</a>
			) : (
				<button
					onClick={() => {
						setHide(false);
					}}
				>
					{title === 'Important' ? 'Dismiss' : 'Confirm'}
				</button>
			)}
		</div>
	);
};

export default Modal;
