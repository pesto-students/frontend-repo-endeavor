import React, { useState } from 'react';
import { Box, IconButton, Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useSwipeable } from 'react-swipeable';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const ImageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
}));

const ImagesWrapper = styled(Box)(({ visibleindex }) => ({
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    transform: `translateX(-${visibleindex * 100}%)`,
}));

const ImageItem = styled(Box)(({ theme }) => ({
    flex: '0 0 33.333%',
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    position: 'relative',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    height: '30px',
    width: '30px',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    '&:disabled': {
        opacity: 0.5,
    },
}));

const HorizontalImageList = ({ pageType, isMultiple, onImageChange, onImagesChange, image, images }) => {
    const [visibleindex, setVisibleindex] = useState(0);
    const [currentImageUrl, setCurrentImageUrl] = useState(null); // Store URL instead of index
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const imagesToShow = 3;

    const handleNext = () => {
        if (visibleindex < images.length - imagesToShow) {
            setVisibleindex((prev) => prev + 1);
        }
    }

    const handlePrev = () => {
        if (visibleindex > 0) {
            setVisibleindex((prev) => prev - 1);
        }
    }

    const handleRemoveImage = (index) => {
        if (isMultiple) {
            const updatedImages = images.filter((_, i) => i !== index);
            onImagesChange(updatedImages);
        } else {
            onImageChange(null);
        }
    }

    const handleOpenDialog = (image) => {
        setCurrentImageUrl(image); // Set URL instead of index
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentImageUrl(null); // Reset URL
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (isMultiple) {
            const newFiles = files.filter((file) =>
                !images.some((image) => (image instanceof File && image.name === file.name))
            );
            const updatedImages = [...images, ...newFiles].slice(0, 10);
            onImagesChange(updatedImages);
        } else {
            const singleImage = files[0];
            if (!image || !(image instanceof File) || (image.name !== singleImage.name)) {
                onImageChange(singleImage);
            }
        }
        // Reset the file input value to allow re-selection of the same file
        e.target.value = '';
    }

    const getImageSrc = (image) => {
        return image instanceof File ? URL.createObjectURL(image) : image;
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {
                isMultiple &&
                <NavigationButton
                    onClick={handlePrev}
                    disabled={visibleindex === 0}
                    sx={{ mr: 1 }}
                >
                    <ArrowBackIosIcon />
                </NavigationButton>
            }

            <ImageContainer {...swipeHandlers}>
                <ImagesWrapper visibleindex={visibleindex} style={{ justifyContent: "center" }}>
                    {isMultiple
                        ? images.map((image, index) => (
                            <ImageItem key={index}>
                                <LazyLoadImage
                                    src={getImageSrc(image)}
                                    alt={`image-${index}`}
                                    effect="blur"
                                    onClick={() => handleOpenDialog(getImageSrc(image))}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        objectFit: 'cover',
                                    }}
                                />
                                {
                                    pageType !== "View" &&
                                    <ActionButton
                                        size="small"
                                        onClick={() => handleRemoveImage(index)}
                                        sx={{ top: 8, right: 8 }}
                                    >
                                        <DeleteIcon style={{ height: '30px' }} />
                                    </ActionButton>
                                }
                                <ActionButton
                                    size="small"
                                    onClick={() => handleOpenDialog(getImageSrc(image))}
                                    sx={{ bottom: 8, right: 8 }}
                                >
                                    <ZoomInIcon style={{ height: '30px' }} />
                                </ActionButton>
                            </ImageItem>
                        ))
                        : image && (
                            <ImageItem style={{ margin: "0 auto" }}>
                                <LazyLoadImage
                                    src={getImageSrc(image)}
                                    alt="single-image"
                                    effect="blur"
                                    onClick={() => handleOpenDialog(getImageSrc(image))}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        objectFit: 'cover',
                                    }}
                                />
                                {
                                    pageType !== "View" &&
                                    <ActionButton
                                        size="small"
                                        onClick={() => handleRemoveImage(0)}
                                        sx={{ top: 8, right: 8 }}
                                    >
                                        <DeleteIcon style={{ height: '30px' }} />
                                    </ActionButton>
                                }
                                <ActionButton
                                    size="small"
                                    onClick={() => handleOpenDialog(getImageSrc(image))}
                                    sx={{ bottom: 8, right: 8 }}
                                >
                                    <ZoomInIcon style={{ height: '30px' }} />
                                </ActionButton>
                            </ImageItem>
                        )}
                </ImagesWrapper>
            </ImageContainer>

            {
                isMultiple && <NavigationButton
                    onClick={handleNext}
                    disabled={visibleindex >= (images?.length || 0) - imagesToShow}
                    sx={{ ml: 1 }}
                >
                    <ArrowForwardIosIcon />
                </NavigationButton>
            }

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent
                    sx={{
                        p: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000',
                    }}
                >
                    {currentImageUrl && (
                        <img
                            src={currentImageUrl}
                            alt="Enlarged view"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100vh',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {
                        pageType !== "View" &&
                        <IconButton color="primary" component="label">
                            <UploadFileIcon fontSize="large" />
                            <input
                                id="upload-button-file"
                                type="file"
                                accept="image/*"
                                multiple={isMultiple}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </IconButton>
                    }
                    {isMultiple ? "Gallery" : "Logo"}
                </div>
            }
        </Box>
    );
};

export default HorizontalImageList;
