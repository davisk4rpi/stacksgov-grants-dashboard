import styles from './Application.module.css';
import Nav from '../components/application/layout/Nav';
import Steps from '../components/application/layout/Steps';
import StacksLogo from '../public/images/stacks-logo.svg';
import Checkmark from '../public/images/checkmark.svg';
import ProjectImpact from '../components/application/ProjectImpact';
import ProjectLinks from '../components/application/ProjectLinks';
import ProjectType from '../components/application/ProjectType';
import { useEffect, useState } from 'react';
import { isValidURL, isValidEmail, isValidStxAddress } from '../components/Input';

import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import ProjectInformation from '../components/application/ProjectInformation';
import ProjectUserInfoOne from '../components/application/ProjectUserInfoOne';
import ProjectUserInfoTwo from '../components/application/ProjectUserInfoTwo';
import ProjectFundingStream from '../components/application/ProjectFundingStream';
import ProjectTrack from '../components/application/ProjectTrack';
import ProjectTags from '../components/application/ProjectTags';
import ProjectRoadmap from '../components/application/ProjectRoadmap';
import ProjectMission from '../components/application/ProjectMission';
import ProjectUserInfoCTwo from '../components/application/ProjectUserInfoCTwo';
import ProjectRevisionsOne from '../components/application/ProjectRevisionsOne';
import ProjectRevisionsTwo from '../components/application/ProjectRevisionsTwo';
import { useSession } from 'next-auth/react';

const Application = () => {
	const { data: session } = useSession();

	useEffect(() => {
		let formData = JSON.parse(localStorage.getItem('formData'));

		if (!formData) localStorage.setItem('formData', JSON.stringify({}));
		formData.githubUsername = session.user.name;
		localStorage.setItem('formData', JSON.stringify(formData));
	}, []);

	const [currentStep, setCurrentStep] = useState(1);

	function handleSubmit() {
		let fields = Array.from(document.querySelectorAll('input, textarea'));
		console.log(fields);

		let invalidFields = [];

		let optionGroupsChecked = [];
		let optionGroupsValid = [];

		fields.map((field) => {
			console.log('FIELD TYPE', field);

			switch (field.name) {
				case 'discordUsername':
				case 'twitterUsername':
					break;
				case 'stxMemo':
					let stxMemoRequired = document.getElementById('stxMemoRequired').checked;
					if (!stxMemoRequired) {
						if (field.value.length == undefined || field.value.length == '') {
							field.style.outlineColor = 'red';
							field.style.borderColor = 'red';
						} else {
							field.style.outlineColor = '#3182ce';
							field.style.borderColor = '#3182ce';
						}
					} else {
						field.style.outlineColor = '#3182ce';
						field.style.borderColor = '#3182ce';
					}
				default:
					switch (field.type) {
						case 'text':
						case 'textarea':
							console.log(`field value for ${field.name}: `, field.value);

							if (field.value == undefined || field.value == '') {
								field.style.outlineColor = 'red';
								field.style.borderColor = 'red';
								invalidFields.push(field.name);
							} else {
								switch (field.name) {
									case 'wishlistGithub':
									case 'referenceLink':
										if (!isValidURL(field.value)) {
											field.style.outlineColor = 'red';
											field.style.borderColor = 'red';
											invalidFields.push(field.name);
										}
										break;
									case 'email':
										if (!isValidEmail(field.value)) {
											field.style.outlineColor = 'red';
											field.style.borderColor = 'red';
											invalidFields.push(field.name);
										}
										break;
									case 'stxAddress':
										if (!isValidStxAddress(field.value)) {
											field.style.outlineColor = 'red';
											field.style.borderColor = 'red';
											invalidFields.push(field.name);
										}
										break;

									default:
										const index = invalidFields.indexOf(field.name);
										if (index > -1) {
											invalidFields.splice(index, 1);
										}
										field.style.outlineColor = '#3182ce';
										field.style.borderColor = '#3182ce';
										break;
								}
							}
							break;
						case 'radio':
							if (!optionGroupsChecked.includes(field.name)) {
								optionGroupsChecked.push(field.name);
							}
							if (!optionGroupsValid.includes(field.name)) {
								if (field.checked) {
									optionGroupsValid.push(field.name);
								}
							}
							break;
					}
					break;
			}
		});
		let optionsValid = optionGroupsChecked.length == optionGroupsValid.length;
		optionsValid ? null : invalidFields.push(optionGroupsChecked[0]);

		console.log('invalid fields', invalidFields);
		let formData = JSON.parse(localStorage.getItem('formData'));

		if (invalidFields.length == 0) {
			setCurrentStep(currentStep + 1);
			fields.map((field) => {
				let { name, value, type } = field;

				switch (type) {
					case 'text':
					case 'textarea':
						formData[name] = value;
						break;
					case 'radio':
						if (field.checked) {
							formData[name] = value;
						}
				}
				localStorage.setItem('formData', JSON.stringify(formData));
			});
		}
	}

	const CurrentStep = () => {
		switch (currentStep) {
			case 1:
				return <ProjectInformation />;
			case 2:
				return <ProjectUserInfoOne />;
			case 3:
				return <ProjectUserInfoTwo />;
			case 4:
				return <ProjectFundingStream />;
			case 5:
				return <ProjectTrack />;
			case 6:
				return <ProjectTags />;
			case 7:
				return <ProjectUserInfoCTwo />;
			case 8:
				return <ProjectRoadmap />;
			case 9:
				return <ProjectRevisionsTwo />;
			case 10:
				return <ProjectImpact />;
			case 11:
				return <ProjectLinks />;
		}
	};

	return (
		<div className={styles.applicationWrapper}>
			<Nav name={'Application'} step={currentStep} />
			<div className={styles.mainComponents}>
				<div id="step" className={styles.middleComponent}>
					<Steps
						setCurrentStep={setCurrentStep}
						step={currentStep}
						steps={[
							'Application Type',
							'User Information (1 of 2)',
							'User Information (2 of 2)',
							'Project Type',
							'Project Track',
							'Project Tags',
							'Project Information',
							'Project Roadmap',
							'Project Mission Statement',
							'Project Impact & Risks',
							'Project Links'
						]}
					/>
				</div>
				<div>{CurrentStep()}</div>
				<div className={styles.button}>
					<button onClick={handleSubmit} name="okButton">
						<Checkmark />
						<p>Ok</p>
					</button>
				</div>
			</div>

			<StacksLogo className={styles.stacksSVG} />
		</div>
	);
};

export default Application;

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(context.req, context.res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	session.user.email = '';
	return {
		props: {
			session
		}
	};
}
