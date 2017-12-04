enum Result {
    Ok = 1000,
    InternalError = 1001,
    Unauthorized = 1002,
    
    InvalidUserId = 1100,
    InvalidCredentials = 1101,
    AlreadyAuthenticated = 1102,
    UserAlreadyExists = 1103,

    InvalidPostId = 1200,
    InvalidImageId = 1201,
    ImageLimitReached = 1202,

    NotImplemented = 9999,
}

export default Result;