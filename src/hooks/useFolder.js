import { doc, getDoc, getDocs, orderBy, query, where, onSnapshot } from "firebase/firestore"
import { useEffect } from "react"
import { useReducer } from "react"
import { useAuth } from "../contexts/AuthContext"
import { database, firestore } from "../firebase"


//ACTIONS object - just to prevent typos
const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder',
    SET_CHILD_FOLDERS: 'set-child-folders',
    SET_CHILD_FILES: 'set-child-files',
}

//Root folder object
export const ROOT_FOLDER = {
    name: 'Root', id: null, path: []
}


//reducer function for useReducer()
function reducer(state, { type, payload }) {
    switch (type) {
        //if user selects a folder other than 'Root', returns selected folder state
        case ACTIONS.SELECT_FOLDER:
            return {
                folderID: payload.folderID,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }

        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders
            }
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles
            }
        default:
            return state;
    }
}

export function useFolder(folderID = null, folder = null) {

    const { currentUser } = useAuth();

    //useReducer function
    const [state, dispatch] = useReducer(reducer, {
        folderID,
        folder,
        childFolders: [],
        childFiles: []
    })

    //triggered when user selects a folder
    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderID, folder } })
    }, [folderID, folder])

    //triggered when only folderID is changed e.g. when change pages
    useEffect(async () => {
        //'Root', where folderID is null
        if (folderID == null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        //addFolder in current folder
        const docRef = doc(firestore, 'folders', folderID)
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: database.formatDoc(docSnap) }
            })
        } else {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }


    }, [folderID])

    //triggered when childFolder is added
    useEffect(async () => {

        // where('parentID', "==", folderID).where("userID", "==", currentUser.uid)
        // orderBy("createdAt")
        // onSnapshot(snapshot, dispatch({
        //     type: ACTIONS.SET_CHILD_FOLDERS,
        //     payload: { childFolders: snapshot.docs.map(database.formatDoc) }

        // }))


        const q = query(database.folders, where('parentID', "==", folderID), where("userID", "==", currentUser.uid), orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            dispatch({
                type: ACTIONS.SET_CHILD_FOLDERS,
                payload: {
                    childFolders: querySnapshot.docs.map(database.formatDoc)
                }
            })
        });

        return unsubscribe;

    }, [folderID, currentUser])

    //triggered when childFiles is added
    useEffect(async () => {


        const q = query(database.files, where('folderID', "==", folderID), where("userID", "==", currentUser.uid), orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: {
                    childFiles: querySnapshot.docs.map(database.formatDoc)
                }
            })
        });

        return unsubscribe;

    }, [folderID, currentUser])
    return state;
}