import React from 'react'
import Dropzone from 'react-dropzone'

import API from '../api/fetchAPI'
import BlockIcon from '@mui/icons-material/Block'

import './FileUpload.scss'

export default function FileUpload({onFileSelect,disabled}) {
    


    const handleDrop = (acceptedFiles) => {
        if(acceptedFiles.length === 1) {
            const file = acceptedFiles[0]
            onFileSelect(file)
        }
    }



        


        





    return (

        <Dropzone
            disabled={disabled}
            onDrop={handleDrop}
            multiple={false}
        >
            {
                ({getRootProps, getInputProps, isDragActive, isDragReject}) => (
                    <div className={`file-upload-dropzone ${disabled ? 'disabled' : ''} ${!disabled && isDragActive ? 'drag-active' : ''}`} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="inner">
                            <p>
                                {
                                    !disabled ? 
                                        isDragActive ?
                                            'Drop file to upload' :
                                            'Drag file here oder click to upload'
                                        :
                                        <BlockIcon />
                                }
                            </p>
                        </div>
                    </div>
                )
            }
        </Dropzone>
    )

}




// https://upmostly.com/tutorials/react-dropzone-file-uploads-react
// https://www.digitalocean.com/community/tutorials/react-react-dropzone



