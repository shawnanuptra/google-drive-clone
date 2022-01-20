import React from 'react'
import { Container } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'
import Folder from './Folder'
import { useLocation, useParams } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'
import File from './File'
export default function Dashboard() {

    const { folderID } = useParams()
    const { state } = useLocation()
    const { folder, childFolders, childFiles } = useFolder(folderID, (state === null) ? null : state.folder);
    return (
        <>
            <Navbar />
            <Container fluid>
                <div className='d-flex align-items-center pt-2'>
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFileButton currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                </div>

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

                {/* A dividing line, if Folders and Files are rendered */}
                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                {childFiles.length > 0 && (
                    <div className='d-flex flex-wrap'>

                        {childFiles.map(childFile => {
                            return (
                                <div key={childFile.id} style={{ maxWidth: '250px' }} className='p-2'>
                                    <File file={childFile} />
                                </div>
                            )
                        })}

                    </div>
                )}
            </Container>
        </>
    )
}
