import React from 'react'
import { Container } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'
import Folder from './Folder'
import { useParams } from 'react-router-dom'

export default function Dashboard() {

    const { folderID } = useParams()
    const { folder, childFolders } = useFolder(folderID);
    return (
        <>
            <Navbar />
            <Container fluid>
                <AddFolderButton currentFolder={folder} />
                {childFolders.length > 0 && (
                    <div className='d-flex flex-wrap'>

                        {childFolders.map(childFolder => {
                            return (
                                <div key={childFolder.id} style={{ maxWidth: '250px' }} className='p-2'>
                                    <Folder folder={childFolder} />
                                </div>
                            )
                        })}

                    </div>

                )}
            </Container>
        </>
    )
}
