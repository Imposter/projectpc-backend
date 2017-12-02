enum Result {
    Ok = 1000,
    InternalError = 1001,
    
    InvalidCredentials = 1100,
    AlreadyAuthenticated = 1101,
    UserAlreadyExists = 1102,

    InvalidPostId = 1200,
    InvalidImageId = 1201,
    InvalidImageIndex = 1202,
    ImageLimitReached = 1203,

    NotImplemented = 9999,
}

export default Result;