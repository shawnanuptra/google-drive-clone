import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { database, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { addDoc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { v4 as uuidV4 } from 'uuid';
import ReactDom from 'react-dom';
import { Toast, ProgressBar } from 'react-bootstrap';

export default function AddFileButton({ currentFolder }) {
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const { currentUser } = useAuth();

    function handleUpload(e) {
        const file = e.target.files[0];
        if (currentFolder == null || file == null) return

        const id = uuidV4();
        setUploadingFiles(prevUploadingFiles => [
            ...prevUploadingFiles,
            { id: id, name: file.name, progress: 0, error: false }
        ])
        const filePath = currentFolder === ROOT_FOLDER
            ? `${currentFolder.path.join('/')}/${file.name}`
            : `${currentFolder.path.join('/')}/${currentFolder.name}/${file.name}`



        const storageRef = ref(storage, `/files/${currentUser.uid}/${filePath}`)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', snapshot => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;

            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.map(uploadFile => {
                    if (uploadFile.id === id) {
                        return { ...uploadFile, progress: progress }
                    }

                    return uploadFile
                })
            })
        }, () => {
            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.map(uploadFile => {
                    if (uploadFile.id === id) {
                        return { ...uploadFile, error: true }
                    }

                    return uploadFile;
                })
            })
        }, () => {

            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.filter(uploadFile => {
                    return uploadFile.id !== id
                })
            })


            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {

                //check if there's duplicate file name
                const q = query(database.files, where("name", "==", file.name), where('userID', '==', currentUser.uid), where('folderID', '==', currentFolder.id))

                const querySnapshot = await getDocs(q);
                const existingFile = querySnapshot.docs[0]
                if (existingFile) {
                    updateDoc(existingFile.ref, { url: downloadURL })
                } else {

                    // If there's no duplicates, just add file
                    addDoc(database.files, {
                        url: downloadURL,
                        name: file.name,
                        createdAt: serverTimestamp(),
                        folderID: currentFolder.id,
                        userID: currentUser.uid
                    })
                }

            });

        })
    }

    return (
        <>
            <label className='btn btn-outline-success btn-sm mx-2'>
                <FontAwesomeIcon icon={faFileUpload} />
                <input type='file' onChange={handleUpload} style={{ opacity: 0, position: 'absolute', left: '-9999px' }} />
            </label>
            {uploadingFiles.length > 0 && ReactDom.createPortal(
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        maxWidth: '250px'
                    }}
                >
                    {uploadingFiles.map(file => (
                        <Toast key={file.id} onClose={() => {
                            setUploadingFiles(prevUploadingFiles => {
                                return prevUploadingFiles.filter(uploadFile => {
                                    return uploadFile.id !== file.id
                                })
                            })
                        }}>
                            <Toast.Header closeButton={file.error} className="text-truncate w-100 d-block">
                                {file.name}
                            </Toast.Header>
                            <Toast.Body>
                                <ProgressBar
                                    animated={!file.error}
                                    variant={file.error ? 'danger' : 'primary'}
                                    now={file.error ? 100 : file.progress * 100}
                                    label={
                                        file.error ? "Error" : `${Math.round(file.progress * 100)}%`
                                    }
                                >
                                </ProgressBar>
                            </Toast.Body>
                        </Toast>
                    ))}

                </div>, document.body
            )}
        </>
    )
}
