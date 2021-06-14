import webviewer from '@pdftron/webviewer';
import { useEffect, useRef, useState } from 'react';

function Testing() {
    const viewer = useRef(null);
    useEffect(() => {
        (async () => {
            const instance = await webviewer({
                path: 'lib',
                initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_about.pdf'
            }, viewer.current)

            instance.setHeaderItems(header => {
                header.push({
                    type: 'actionButton',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
                    onClick: async () => {
                        await annotManager.exportAnnotations({ links: false, widgets: false })
                    }
                });
            });
            instance.setHeaderItems(header => {
                header.push({
                    type: 'actionButton',
                    img: 'https://image.flaticon.com/icons/png/128/3022/3022251.png',
                    onClick: async () => {
                        instance.print()
                    }
                });
            });
            instance.setHeaderItems(header => {
                header.push({
                    type: 'actionButton',
                    img: 'https://www.svgrepo.com/show/140007/download-button.svg',
                    onClick: async () => {
                        instance.downloadPdf()
                    }
                });
            });

            const { Annotations, annotManager, docViewer, PDFNet } = instance;
            instance.setHeaderItems(header => {
              header.push({
                type: 'actionButton',
                img: 'https://www.svgrepo.com/show/140007/download-button.svg',
                onClick: () => {

                  const flags = new Annotations.WidgetFlags()
                  flags.set('Required', true);
                  const field = new Annotations.Forms.Field("some signature field name", {
                    type: 'sign',
                    flags,
                  });

                  // create a widget annotation
                  var widgetAnnot = new Annotations.SignatureWidgetAnnotation(field, {
                    appearance: '_DEFAULT',
                    appearances: {
                      _DEFAULT: {
                        Normal: {
                          data:
                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC',
                          offset: {
                            x: 100,
                            y: 100,
                          },
                        },
                      },
                    },
                  });
                  widgetAnnot.PageNumber = 1;
                  widgetAnnot.X = 100;
                  widgetAnnot.Y = 100;
                  widgetAnnot.Width = 50;
                  widgetAnnot.Height = 20;

                  annotManager.addAnnotation(widgetAnnot);
                  annotManager.drawAnnotationsFromList([widgetAnnot]);
                  annotManager.getFieldManager().addField(field);

                }

              });
            });



            // create a form field

            docViewer.on('documentLoaded', async () => {

                const rectangleAnnot = new Annotations.RectangleAnnotation();
                rectangleAnnot.PageNumber = 1;
                rectangleAnnot.X = 100;
                rectangleAnnot.Y = 150;
                rectangleAnnot.Width = 200;
                rectangleAnnot.Height = 50;
                rectangleAnnot.Author = annotManager.getCurrentUser();

                annotManager.addAnnotation(rectangleAnnot);
                // need to draw the annotation otherwise it won't show up until the page is refreshed
                annotManager.redrawAnnotation(rectangleAnnot);
                annotManager.on('annotationChanged', async () => {
                    await annotManager.exportAnnotations({ links: false, widgets: false })
                })

            })
        })()

    }, [])
    return (
        <>
            <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>

        </>
    );
}
export default Testing