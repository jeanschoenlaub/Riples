// CreateRipleModal.tsx
import React, { useEffect, useState } from 'react';
import type { CreateRipleModalProps, CreateRiplePayload } from './createripletypes';
import toast from 'react-hot-toast';
import { useRipleMutation } from './createripleapi';
import { api } from "~/utils/api";
import { useSelector } from 'react-redux';
import type { RootState } from '~/redux/store';
import RipleTextComponent from './ripletext';
import RipleHTMLComponent from './riplehtml';
import { LoadingSpinner, Modal, ArrowLeftSVG, ArrowRightSVG, RocketSVG } from '~/components';
import { useWizard } from "~/features/wizard";

enum Step {
    RipleText,
    RipleHTML
}

type RipleImage = {
    url: string;
    id: string;
    caption: string;
}

export const CreateRipleModal: React.FC<CreateRipleModalProps> = ({ showModal, onClose, projectId, projectCoverImageId, projectTitle, projectSummary }) => {
    const [ripleContent, setRipleContent] = useState('');
    const [ripleHTMLContent, setRipleHTMLContent] = useState('');
    const [ripleTitle, setRipleTitle] = useState('');
    const [currentStep, setCurrentStep] = useState(Step.RipleText);
    const wizardContext = useWizard();

    const [ripleImages, setRipleImages] = useState<RipleImage[]>([]);

    const handleRipleSubmit = () => {
        const payload = generateCreatePayload();
        createRiple(payload).then(() => {
          toast.success('Riple created successfully!');
          resetForm();
        })
        .catch(() => {
          toast.error('Error creating riple');
        });
    };
    
    const resetForm = () => {
        setRipleTitle(''); // Reset content after submitting
        setRipleContent(''); 
        setRipleHTMLContent('');// Reset content after submitting
        setCurrentStep(Step.RipleText);  
        onClose() //Managing wizard there
    }

    const generateCreatePayload = (): CreateRiplePayload => {
        // Extract the image IDs from ripleImages state
        const ripleImagesWithCaptions = ripleImages.map(img => ({ id: img.id, caption: img.caption }))

        return {
            projectId: projectId,
            projectTitle: projectTitle,
            title: ripleTitle,
            content: ripleHTMLContent,
            ripleImages: ripleImagesWithCaptions,
        };
    };

    useEffect (() => {
        if (showModal){
            wizardContext.setWizardName("projectriples")
            wizardContext.setRipleWizardModalStep("text") //This will change RipleWizardMode to text writer
            wizardContext.setProjectTitle(projectTitle)
            wizardContext.setProjectSummary(projectSummary)
            wizardContext.setShowWizard(true)
        }
        if (!showModal){ //onClose
            //wizardContext.setWizardName("")
            //wizardContext.setShowWizard(false)
            resetForm();
        }
    },[showModal])

    const appendImagesToContent = (content: string, images: { url: string; caption: string }[]): string => {
        let imageHtml = "";

        // Replace all backspaces with the desired string
        content = content.replace(/\n+/g, '</p></br><p>');
    
        images.forEach(image => {
            imageHtml += `
            <br>
            <div style="display: flex; justify-content: center;">
                <div style="text-align: center;">
                    <img src="${image.url}" alt="Uploaded Image" style="width: auto; margin: 0 auto; display: block;" class="responsive-image">
                    <p style="font-style: italic;">${image.caption}</p>
                </div>
            </div><br>
            `;
        });
        
        return  `<p>${content}</p><br>` + imageHtml;
    };

    useEffect (() => {
        if (currentStep === Step.RipleHTML ){
            const updatedContent = appendImagesToContent(ripleContent, ripleImages);
            wizardContext.setRipleContent(updatedContent);
            setRipleHTMLContent(updatedContent);
            wizardContext.setRipleWizardModalStep("html") //This will change RipleWizardMode from text writer to HTML writer
            wizardContext.setShowWizard(true)
        }
        if (currentStep === Step.RipleText ) {
            wizardContext.setRipleContent("")
            wizardContext.setRipleWizardModalStep("text") //This will change RipleWizardMode to text writer
        }
    },[currentStep])

    useEffect (() => {
        wizardContext.setRipleContent(ripleContent);
    },[ripleContent])

    useEffect (() => {
        wizardContext.setRipleContent(ripleHTMLContent);
        
    },[ripleHTMLContent])
    
    const ripleContentFromRedux = useSelector((state: RootState) => state.riple.ripleContent);
    useEffect(() => {
      if (ripleContentFromRedux.length){
        if (currentStep === Step.RipleText){setRipleContent(ripleContentFromRedux)}
        if (currentStep === Step.RipleHTML){setRipleHTMLContent(ripleContentFromRedux)}
      } 
    }, [ripleContentFromRedux]);

    const { data: followers } = api.projectFollowers.getFollowersByProjectId.useQuery({ projectId: projectId });
    const { isCreating, createRiple } = useRipleMutation(followers);

    const isLoading = isCreating

    const nextStep = () => {
        if (currentStep === Step.RipleText) {
            setCurrentStep(Step.RipleHTML);
        }
    };

    const prevStep = () => {
        if (currentStep === Step.RipleHTML) {
            setCurrentStep(Step.RipleText);
        }
    };

    return (
        <Modal showModal={showModal} size="large" Logo={false} onClose={onClose}>
             {currentStep === Step.RipleText &&
                <RipleTextComponent
                    ripleTitle={ripleTitle}
                    setRipleTitle={setRipleTitle}
                    ripleContent={ripleContent}
                    setRipleContent={setRipleContent}
                    isLoading={isLoading}
                    ripleImages={ripleImages}
                    setRipleImages={setRipleImages}
                />
            }

            {currentStep === Step.RipleHTML &&
                <RipleHTMLComponent
                    ripleTitle={ripleTitle}
                    setRipleTitle={setRipleTitle}
                    ripleHTMLContent={ripleHTMLContent}
                    setRipleHTMLContent={setRipleHTMLContent}
                    projectTitle={projectTitle}
                    projectCoverImageId={projectCoverImageId}
                    isLoading={isLoading}
                />
            }

        <div className="flex justify-between mt-4">
            <span className="text-lg flex justify-center items-center space-x-4 w-auto">
                {currentStep !== Step.RipleText && (
                    <button 
                        onClick={prevStep}
                        className="bg-blue-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
                        disabled={isLoading}
                    >
                        <span className='flex items-center'>
                            <ArrowLeftSVG width="4" height="4" marginRight="2"></ArrowLeftSVG>
                            Previous 
                        </span>
                    </button>
                )}
            </span>
            <span className="text-lg flex justify-center items-center space-x-4 w-auto">
                {currentStep !== Step.RipleHTML ? (
                    <button 
                        onClick={nextStep}
                        className="bg-blue-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
                        disabled={isLoading}
                    >
                        <span className='flex items-center'>
                            Next 
                            <ArrowRightSVG width="4" height="4" marginLeft="2"></ArrowRightSVG>
                        </span>
                    </button>
                ) : (
                    <button 
                        onClick={handleRipleSubmit}
                        className="bg-green-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
                        disabled={isLoading}
                    >
                        <span className='flex items-center space-x-2'>
                            Create
                            {isLoading ? <LoadingSpinner size={20} /> : <RocketSVG width="4" height="4" marginLeft="2"></RocketSVG>}
                        </span>
                    </button>
                )}
            </span>
        </div>

        </Modal>
    );
}
