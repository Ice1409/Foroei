import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: "iceoei",
  private_key_id: "a936838fc9d731b100f0ef9899c52831a312f98d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8OOtF/eGygM5N\nBVy5iUf/2xKwBqagfuoEUwsiEMuoBJnAPopjTiPUlSC2lYl5fhUJD5TtoLliMxQ+\nGYkF95xT+7rZfBE7ODjLkCCyE4ZPA60wqvLL8SfEs5QojafM3XWvQrWCmCl+2Ed3\nTXZzYv7z34bbUV0j/feH9Xh04OFpNPTlJXp+DP8aCzJfxD22wfmWlLJ1pDLOsbCw\nw/HwYPtUHXpur4Ec1W6ShWrZ6JXwqRLYlb+VpS/9//0cwpUgtWpIj8gFuoXUevaO\nBiUuuI8BKHkRjyHk11CbTYIhScbf6V4C4kq9JOmxDwPbhc8E4YUNqwfewz+2fR3H\nzgxLLfopAgMBAAECggEAFeYGEs/DGAUIu4j3AkvDZDRP8XSR+Kn7aRhjpbQliv1K\nCXCyoh4fvhEW9sHhdjtMkDrPXXGYeqEtvDyKpsvpqhMSE1FDd0vcaRac2eBlUmu/\nlSIhJcgqE9EULj8DjwAUZpkmIV+5st0lPMShljLQ2H0g+q2giVpNbR81Q108ly7o\n7gbzhvWvlMrvsJjmnxVTlnr5UlNFPYFOZEWsDLH//W7GmHW5jsTb4zq4yeFbjuMG\n4CFSNTwnbpcpV+yNZN88EZavyXyAPYNcW9ofCPWHqSD32fERR2Ba2jNGHkp5z+6D\nMqAfnO16j3QF6jrfwJppbsZVf58VZaTp8dfvGLDPTwKBgQDy5895ZQXuT4gecY+0\nCTdIBiT1kOFQLe/e+MWk6m3EtKNT4+P5i38JAUUuMT7r9dd4esEPdK8LgxPSa/P+\n4yLAmC6lLKA2ubwzaAnYmmVdPV2jlLuYt12y4YK2m94Ysa/quTpSFdblQBO2FdS4\nNO1jDdgjqWkKotVIemK2ZzjE6wKBgQDGXnW1PqhPtdz1F1eWfLK+BADhqhei5PCU\nrXoP/q30QnYU3OV1raYxRxkTyLdE8iR6e3WVHE96iNvARI4aGfDAdVuq63J5QE5Z\nFFIHoxWagZ+z2sU/gu85u8H0R0hBfecQuxDMuDZH0+DOhw3txhruuvnVk7djHGh5\noqhnaYPIOwKBgAZGYMC1EGMooM6QhnLTLh9pMTk6xedJWIH9ETYCbFWBiRqYr4H5\nzY1RABWCZiq4ThmpqiUZEZCNkUyFR2dVPMeW5tWTgowHXkpBrMdwrZ+r/yhDplj6\nm6wMUVEgU6t1o6K/qDcIo2WGszun8rfTfjJp4CSDstf4fuQBbV1i6z+DAoGBAMS8\nCBdh9gFgB6zXoplwQMFtLQah7+ExF10NE8LrPdDDXWLhlXz5ZJr4vWk+pmxtjjof\nWYUx161aMD9mflxqn7fwbKJ98kFIwqtcGOLUHmfm6OGyNfAARovGp9xCGepCGLki\nHc47YDIqc4nArdLEqA9eRstIPhfAo+kGpegx4G3jAoGBAO9p9TZzrVA+SVG/C2Xe\n3grNRf4rR5yfWqIHX2qBbitOq5UycJExDeqZJvW2tq8gjbgifpXWveBuO38mHuyz\n9wE2e31fQ6dPrsHedEe9Q78prlEkRp59yCgEeOztomLDNLXigPeY6ETsk6CCPtvV\nfjEcEVrM0uH14tpila1pz3J4\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@iceoei.iam.gserviceaccount.com",
  client_id: "100466391964771425010",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40iceoei.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

// Initialize Firebase Admin SDK
let app
let db

try {
  // Check if the app has already been initialized
  app = initializeApp(
    {
      credential: cert(serviceAccount as any),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    },
    "iceoei-admin",
  )

  db = getFirestore(app)
} catch (error) {
  // If the app is already initialized, get the existing app
  console.error("Firebase admin initialization error:", error)
}

export { db }

