import React, {
    useEffect,
    useRef
} from 'react';
import webViewer from '@pdftron/webviewer';


export default function PDFcompare() {
    let viewer = useRef(null)
    useEffect(() => {
        (async () => {
            const instance = await webViewer({
                path: 'lib',
                fullAPI:true
            }, viewer.current)
            const {
                Annotations,
                annotManager,
                docViewer,
                PDFNet,
                CoreControls,
                loadDocument,
                iframeWindow
            } = instance;
            // docViewer.on('documentLoaded', async () => {
                await PDFNet.initialize();

                const getDocument = async (url) => {
                    const newDoc = await CoreControls.createDocument(url,{loadAsPDF:true});
                    return await newDoc.getPDFDoc();
                };

                const [doc1, doc2] = await Promise.all([
                    getDocument('https://s3.amazonaws.com/pdftron/pdftron/example/test_doc_1.pdf'),
                    getDocument('https://pdftron.s3.amazonaws.com/downloads/pl/form1.pdf')
                ])
                const getPageArray = async (doc) => {
                    const arr = [];
                    const itr = await doc.getPageIterator(1);
    
                    for (itr; await itr.hasNext(); itr.next()) {
                        const page = await itr.current();
                        arr.push(page);
                    }
    
                    return arr;
                }
    
                const [doc1Pages, doc2Pages] = await Promise.all([
                    getPageArray(doc1),
                    getPageArray(doc2)
                ]);
                const newDoc = await PDFNet.PDFDoc.create();
                newDoc.lock();
    
                // we'll loop over the doc with the most pages
                const biggestLength = Math.max(doc1Pages.length, doc2Pages.length)
    
                // we need to do the pages in order, so lets create a Promise chain
                const chain = Promise.resolve();
    
                for (let i = 0; i < biggestLength; i++) {
                    chain.then(async () => {
                        const page1 = doc1Pages[i];
                        const page2 = doc2Pages[i];
    
                        // handle the case where one document has more pages than the other
                        if (!page1) {
                            page1 = new PDFNet.Page(0); // create a blank page
                        }
                        if (!page2) {
                            page2 = new PDFNet.Page(0); // create a blank page
                        }
                        return newDoc.appendVisualDiff(page1, page2,null)
                    })
                }
    
                await chain; // wait for our chain to resolve
                newDoc.unlock();
                loadDocument(newDoc);

            // })
   
        })()

    }, [])
    return ( 
    <div >

    <div className = "webviewer"

        ref = {
            viewer
        }
        style = {
            {
                height: "100vh"
            }
        } > </div>

        
        </div>
    )
}