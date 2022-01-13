import React, { useState } from 'react'
import { Button, Form, Modal, ModalBody, ModalFooter } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'

export default function AddFolderButton() {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    function openModal() {
        setOpen(true)

    }

    function closeModal() {
        setOpen(false);
    }

    function handleSubmit() {
        e.preventDefault();

        //Create a folder in the databse

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
