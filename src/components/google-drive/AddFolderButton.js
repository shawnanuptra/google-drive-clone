import React, { useState } from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { database } from '../../firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';

export default function AddFolderButton( {currentFolder}) {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const {currentUser} = useAuth();

    function openModal() {
        setOpen(true)

    }

    function closeModal() {
        setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (currentFolder == null) return

        const path= [...currentFolder.path]
        if (currentFolder != ROOT_FOLDER) {
            path.push({name: currentFolder.name, id: currentFolder.id})
        }

        //Create a folder in the database
        await addDoc(database.folders, {
            name: name,
            parentID: currentFolder.id,
            userID: currentUser.uid,
            path: path,
            createdAt: serverTimestamp()
        })

        setName('')
        closeModal()
    }
    return (
        <>
            <Button onClick={openModal} variant='outline-success' size='sm'>
                <FontAwesomeIcon icon={faFolderPlus} />
            </Button>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}> 

                    <ModalBody>
                        <Form.Group>
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control required type="text" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant='success' type=
                        'submit'>Add Folder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    )
}
