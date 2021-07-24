import 'pro-gallery/dist/statics/main.css';
import React from 'react';
import ExpandableProGallery from './expandableGallery';

export function PhotoPage(): JSX.Element {
    // Add your images here...
    const items = [
        {
            // Image item:
            itemId: 'sample-id',
            mediaUrl: 'https://i.picsum.photos/id/674/200/300.jpg?hmac=kS3VQkm7AuZdYJGUABZGmnNj_3KtZ6Twgb5Qb9ITssY',
            metaData: {
                type: 'image',
                height: 200,
                width: 100,
                title: 'sample-title',
                description: 'sample-description',
                focalPoint: [0, 0],
                link: {
                    url: 'http://example.com',
                    target: '_blank'
                }
            }
        },
        {
            // Another Image item:
            itemId: 'differentItem',
            mediaUrl: 'https://i.picsum.photos/id/1003/1181/1772.jpg?hmac=oN9fHMXiqe9Zq2RM6XT-RVZkojgPnECWwyEF1RvvTZk',
            metaData: {
                type: 'image',
                height: 200,
                width: 100,
                title: 'sample-title',
                description: 'sample-description',
                focalPoint: [0, 0],
                link: {
                    url: 'http://example.com',
                    target: '_blank'
                }
            }
        }
    ];

    // The options of the gallery (from the playground current state)
    const options = {
        galleryLayout: -1,
        hoveringBehaviour: 'NEVER_SHOW',
        scrollAnimation: 'MAIN_COLOR',
        imageHoverAnimation: 'ZOOM_IN',
        itemBorderRadius: 5,
        allowContextMenu: true
    };

    // The size of the gallery container. The images will fit themselves in it
    const container = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    // The eventsListener will notify you anytime something has happened in the gallery.
    const eventsListener = (eventName: unknown, eventData: unknown): void => console.log({eventName, eventData});

    return (
        <ExpandableProGallery
            items={items}
            options={options}
            container={container}
            eventsListener={eventsListener}
            scrollingElement={window}
            viewMode={1}
        />
    );
}

// Enjoy using your new gallery!
// For more options, visit https://github.com/wix/pro-gallery