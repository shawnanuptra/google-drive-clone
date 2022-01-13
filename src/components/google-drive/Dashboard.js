import React from 'react'
import { Container } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'

export default function Dashboard() {

    const { folder } = useFolder('fJMdTTzVRmYqrlQS3IUs');
    console.log(folder)
    return (
        <>
        <Navbar />
        <Container fluid>
            <AddFolderButton currentFolder={folder}/>
        </Container>
        </>
    )
}
