package code;

import java.net.*;
import java.io.*;
import java.util.*;

public class Server {
    static private Map<String, String> map;
    static private Map<String, Map<String,String>> data;

    public static void main(String[] args) throws IOException {
        map = new HashMap<>();
        data = new HashMap<>();

        ServerSocket serverSocket = new ServerSocket(8080);

        while(true) {
        System.out.println("[LISTENING] Server is listening...");
        Socket connectionSocket = serverSocket.accept(); 
        new Thread(new ClientHandler(connectionSocket)).start();
        //serverSocket.close();
        //break;
        }
    }

    static class ClientHandler implements Runnable {
        Socket connectionSocket;
        BufferedReader inFromClient;
        PrintWriter outToClient;
        String guestPrefix;
        String adminPrefix;
        
        ClientHandler(Socket connectionSocket) throws IOException {
            this.connectionSocket = connectionSocket;
            guestPrefix = "[USER "+connectionSocket.getPort()+"] ";
            adminPrefix = "[ADMIN "+connectionSocket.getPort()+"] ";
            createCientHandler(connectionSocket);
        }
    
        // Client handler will maintain connection with one client
        // Think like a privacy portal of a company
        void createCientHandler(Socket connectionSocket) throws IOException{
            System.out.println(guestPrefix+"User connected");
            inFromClient = new BufferedReader(new InputStreamReader(connectionSocket.getInputStream()));
            outToClient = new PrintWriter(new OutputStreamWriter(connectionSocket.getOutputStream()));
        }
    
        String[] recvFromClient() throws IOException {
            String recvString = inFromClient.readLine();
            String recvStringArray[] = recvString.split(" ");
            System.out.println(guestPrefix +"Received: " + recvString);
            return recvStringArray;
        }
    
        void sendToClient(String s) throws IOException {
            outToClient.println(s);
            outToClient.flush();
        }
    
        void handleClientThread() {
            while(true) {
                try {
                    String s[] = recvFromClient();
                    if(s[0].equals("q")) {
                        break;
                    }
                    if(s[0].equals("admin")) {
                        handleadmin();
                    }
                    else sendToClient(handleClient(s));
                }
                catch(Exception e) {
                    System.out.println(e.getMessage());
                    break;
                }
            }
        }
    
        public void run() {
            handleClientThread();
        }
    
        String handleClient(String s[]) throws IOException{
            String outString = "";  // outString will store all the values for the get commands
            if(s[0].equals("admin")) {
                handleadmin();
            }
            else {
                for(int i = 0; i < s.length; i++) {
                    if(s[i].equals("put")) {
                        map.put(s[i+1], s[i+2]);
                        data.put(connectionSocket.getPort() + "", new HashMap<>(map));
                    }
                    if(s[i].equals("get")) {
                        outString+=data.get(connectionSocket.getPort()+"").get(s[i+1]);
                        outString+=",";
                    }
                }
            }
            System.out.println(data);
            return outString;
        }

        void handleadmin() throws IOException {
            
            sendToClient("askpass");
            String a[] = recvFromClient();
            if(a[0].equals("1234")) {
                sendToClient("authsucess");
                do {
                    String b[] = recvFromClient();
                    System.out.println(b[0]);
                    if(b[0].equals("0")) break;
                    if(b[0].equals("1")) 
                        sendToClient(data.toString());
                    else if(b[0].equals("2")) {
                        sendToClient("askval");
                        String c[] = recvFromClient();
                        map.put(c[1],c[2]);
                        data.put(c[0], map);
                        sendToClient("Value updated");
                        //sendToClient(data.toString());
                    }
                } while(true);
            }
            else {
                sendToClient("authfail");
                return;                     
            }
        }

    }   // end of ClientHandler class

}   // end of Server