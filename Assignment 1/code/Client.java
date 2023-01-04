package code;
import java.io.*;
import java.net.*;
//import java.util.*;

public class Client {
    Socket clientSocket;
    BufferedReader inFromServer;
    PrintWriter outToServer;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        Client ob = new Client();
        ob.createClient();
        System.out.println("Enter your message: ");
        String i = br.readLine();
        ob.sendToServer(i);
        ob.recvFromServer();
        //ob.closeClient();
    }

    void createClient() throws IOException {
        clientSocket = new Socket("localhost", 8080);
        inFromServer = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        outToServer = new PrintWriter(new OutputStreamWriter(clientSocket.getOutputStream()));
    }

    void sendToServer(String outputString) throws IOException {
        outToServer.println(outputString);
        outToServer.flush();
        System.out.println("Sent message: " + outputString + " to " + clientSocket.getInetAddress());
    }

    void recvFromServer() throws IOException {
        String recvString = inFromServer.readLine();
        String output[] = recvString.split(",");
        for(int i = 0; i < output.length; i++)
            if(output[i].equals("null"))
                System.out.println("\n");
            else
                System.out.println(output[i]);
    }

    void closeClient() throws IOException {
        clientSocket.close();
        inFromServer.close();
        outToServer.close();
    }
}
