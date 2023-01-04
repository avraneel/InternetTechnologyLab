package code;
import java.net.*;
import java.io.*;
import java.util.*;

/*
 * TODO: 
 * - use ArrayList data to store for multiple users
 */

public class Server {
    static protected Map<String, String> map;
    static protected List<Map<String,String>> data;

    public static void main(String[] args) throws IOException {
        map = new HashMap<>();
        data = new ArrayList<>();
        ServerSocket serverSocket = new ServerSocket(8080);
        Socket connectionSocket;
        while(true) {
            System.out.println("[LISTENER THREAD] Server is listening at " + serverSocket.getInetAddress()+ ":" + serverSocket.getLocalPort());
            connectionSocket = serverSocket.accept(); 
            new Thread(new ClientHandler(connectionSocket)).start();
        }
    }
}

class ClientHandler extends Server implements Runnable {
    Socket connectionSocket;
    BufferedReader inFromClient;
    PrintWriter outToClient;
    
    ClientHandler(Socket connectionSocket) throws IOException {
        this.connectionSocket = connectionSocket;
        createCientHandler(connectionSocket);
    }

    void createCientHandler(Socket connectionSocket) throws IOException{
        System.out.println("[CLIENT " + connectionSocket.getPort() + "] Successfully connected.");
        inFromClient = new BufferedReader(new InputStreamReader(connectionSocket.getInputStream()));
        outToClient = new PrintWriter(new OutputStreamWriter(connectionSocket.getOutputStream()));
    }

    String[] recvFromClient() throws IOException {
        String recvString = inFromClient.readLine();
        String recvStringArray[] = recvString.split(" ");
        System.out.println("[CLIENT " + connectionSocket.getPort() + "] Received: " + recvString);
        return recvStringArray;
    }

    void sendToClient(String s) throws IOException {
        //System.out.println(s);
        outToClient.println(s);
        outToClient.flush();
    }

    void handleClientThread() {
        try {
            sendToClient(handleClient(recvFromClient()));
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void run() {
        handleClientThread();
    }

    String handleClient(String s[]) {
        String outString = "";  // outString will store all the values for the get commands
        for(int i = 0; i < s.length; i++) {
            if(s[i].equals("put")) {
                map.put(s[i+1], s[i+2]);
                //System.out.println(map.get(s[i+1]));
            }
            if(s[i].equals("get")) {
                outString+=map.get(s[i+1]);
                outString+=",";
            }
        }
        return outString;
    }
}